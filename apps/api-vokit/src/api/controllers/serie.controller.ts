import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import { Card, CardSerie, CardSet, CardType } from '../../database';
import {
  CardAdditionalPrintingCreatorEnum,
  CardAdditionalPrintingTypeEnum,
  CardCategoryEnum,
  CardRarityEnum,
  ICreateSetBody,
  IGetAllSeriesResponse,
  IImportDataBody,
  IResponse,
  ISerieUpdateBody,
  ISerieUpdateResponse,
  PokecardexCardCategoryEnum,
} from 'vokit_core';
import { ISetUpdateResponse, ISetUpdateBody } from 'vokit_core';
import { HttpResponseError } from './../../modules/http-response-error';
import SerieValidation from '../validations/serie.validation';
import { getRarityFromPokecardex } from '../../utils/get-rarity';
import { CardAdditionalPrinting } from '../../database/models/card-additional-printing.model';
import {
  PreSignUrlType,
  generateApplicationFileThumbnail,
  getPreSignedUrlApplicationFile,
  uploadApplicationFile,
} from 'abyss_storage_core';
import axios from 'axios';
import { PokecardexCardTypeEnum } from 'vokit_core';
import { CardTypeEnum } from 'vokit_core';
import { nonBlockingPromise } from '../../utils/non-blocking-promise.utils';

class SerieController implements Controller {
  private static readonly logger = new LoggerModel(SerieController.name);

  async getAllSeries(
    _req: Request<Record<string, never>, IGetAllSeriesResponse, void>,
    res: Response<IGetAllSeriesResponse, ILocals>,
  ): Promise<void> {
    const series = await CardSerie.findAll({
      include: [
        {
          model: CardSet,
          as: 'cardSets',
        },
      ],
      order: [
        ['id', 'DESC'],
        [{ model: CardSet, as: 'cardSets' }, 'releaseDate', 'DESC'],
      ],
    });

    res.json({
      data: series,
    });
  }

  async createSet(
    req: Request<Record<string, never>, void, ICreateSetBody>,
    res: Response<IResponse<void>, ILocals>,
  ): Promise<void> {
    req.body = SerieValidation.createSet(req.body);

    await CardSet.create({ cardSerieId: req.body.cardSerieId });
    res.send();
  }

  async updateSet(
    req: Request<Record<string, never>, ISetUpdateResponse, ISetUpdateBody>,
    res: Response<IResponse<ISetUpdateResponse>, ILocals>,
  ): Promise<void> {
    req.body = SerieValidation.updateSet(req.body);
    const set = await CardSet.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!set) throw HttpResponseError.createNotFoundError();

    await set.update({
      name: req.body.name,
      cardSerieId: req.body.cardSerieId,
      releaseDate: req.body.releaseDate,
      code: req.body.code,
      imageId: req.body.imageId ?? '',
      logoId: req.body.logoId ?? '',
    });

    await set.reload();

    res.json({ data: { cardSet: set } });
  }

  async updateSerie(
    req: Request<Record<string, never>, ISerieUpdateResponse, ISerieUpdateBody>,
    res: Response<IResponse<ISerieUpdateResponse>, ILocals>,
  ): Promise<void> {
    req.body = SerieValidation.updateSerie(req.body);

    const serie = await CardSerie.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!serie) throw HttpResponseError.createNotFoundError();

    await serie.update({
      name: req.body.name,
      code: req.body.code,
    });

    await serie.reload();

    res.json({ data: { cardSerie: serie } });
  }

  async createSerie(_req: Request, res: Response): Promise<void> {
    await CardSerie.create();

    res.send();
  }

  async importData(
    req: Request<Record<string, never>, void, IImportDataBody>,
    res: Response<IResponse<void>, ILocals>,
  ): Promise<void> {
    req.body = SerieValidation.importData(req.body);

    SerieController.logger.info(`Importing new cards for set ${req.body.id}`);

    nonBlockingPromise(
      (async () => {
        const set = await CardSet.findOne({
          where: {
            id: req.body.id,
          },
        });

        if (!set) throw HttpResponseError.createNotFoundError();

        const existingCards = await Card.findAll({
          where: {
            setId: set.id,
          },
        });

        for (const card of req.body.data) {
          let existingCard = existingCards.find((e) => {
            if (e.localId === card.id) return true;
            if (Number(e.localId).toString() === card.id) return true;
          });

          if (req.body?.ignoreDuplicate) {
            existingCard = undefined;
          }

          if (!existingCard) {
            SerieController.logger.info(`Creating card ${set.code}-${card.id}`);

            existingCard = await Card.create({
              name: card.name,
              rarity: getRarityFromPokecardex(card.rarity) as unknown as CardRarityEnum,
              category: (PokecardexCardCategoryEnum[
                card.type as keyof typeof PokecardexCardCategoryEnum
              ] ?? PokecardexCardCategoryEnum['Pokemon']) as unknown as CardCategoryEnum,
              canBeReverse: card.canBeReverse,
              localId: card.id,
              setId: set.id,
            });
          } else {
            existingCard.update({
              name: card.name,
              rarity: getRarityFromPokecardex(card.rarity) as unknown as CardRarityEnum,
              category: (PokecardexCardCategoryEnum[
                card.type as keyof typeof PokecardexCardCategoryEnum
              ] ?? PokecardexCardCategoryEnum['Pokemon']) as unknown as CardCategoryEnum,
              canBeReverse: card.canBeReverse,
              localId: card.id,
              setId: set.id,
            });
          }

          if (
            !existingCard.imageId &&
            card.image !== '//www.pokecardex.com/assets/images/verso.jpg'
          ) {
            const image: ArrayBuffer = (
              await axios.get('https://' + card.image.substring(2), {
                responseType: 'arraybuffer',
              })
            ).data as ArrayBuffer;

            if (image) {
              try {
                SerieController.logger.info(`Getting image for ${card.id}`);
                const url = await getPreSignedUrlApplicationFile(
                  {
                    applicationId: process.env.APPLICATION_ID || '',
                  },
                  {
                    type: PreSignUrlType.UPLOAD,
                    fileName: set.code + '-' + existingCard.localId,
                    shouldGeneratePublicAccess: true,
                  },
                );
                SerieController.logger.info(`Uploading image for ${card.id}`);

                const abyssImage = await uploadApplicationFile(
                  {
                    token: url.data.preSignUrl,
                  },
                  {
                    should_skip_await_webhook_delivery: true,
                    should_not_generate_thumbnail: true,
                  },
                  image,
                );
                SerieController.logger.info(`Generating thumbnail for ${card.id}`);

                const thumbnail = await generateApplicationFileThumbnail(
                  {
                    applicationFileId: abyssImage.data.applicationFile.id ?? '',
                    applicationId: abyssImage.data.applicationFile.applicationId,
                  },
                  {
                    resolution: {
                      x: 230,
                      y: 315,
                    },
                    name: set.code + '-' + existingCard.localId + '-LOW',
                  },
                );

                existingCard.update({
                  imageId: abyssImage.data.applicationFile.publicAccessId ?? '',
                  thumbnailId: thumbnail.data.applicationFileThumbnail?.publicAccessId,
                });
              } catch (e: any) {
                console.log(e?.response?.data);

                throw HttpResponseError.createInternalServerError();
              }
            }
          }

          const cardTypes = await CardType.findAll({
            where: {
              cardId: existingCard.id,
            },
          });
          SerieController.logger.info(`Updating card types for ${card.id}`);

          await Promise.all(
            cardTypes.map(async (cardType, index) => {
              if (index > 0) {
                return await cardType.destroy();
              }
              if (PokecardexCardTypeEnum[card.type as keyof typeof PokecardexCardTypeEnum]) {
                if (
                  cardType.type !==
                  (PokecardexCardTypeEnum[
                    card.type as keyof typeof PokecardexCardTypeEnum
                  ] as unknown as CardTypeEnum)
                ) {
                  return await cardType.update({
                    type: PokecardexCardTypeEnum[
                      card.type as keyof typeof PokecardexCardTypeEnum
                    ] as unknown as CardTypeEnum,
                  });
                }
              } else {
                return await cardType.destroy();
              }
            }),
          );

          if (
            !cardTypes[0] &&
            PokecardexCardTypeEnum[card.type as keyof typeof PokecardexCardTypeEnum]
          ) {
            await CardType.create({
              type: PokecardexCardTypeEnum[
                card.type as keyof typeof PokecardexCardTypeEnum
              ] as unknown as CardTypeEnum,
              cardId: existingCard.id,
            });
          }
          SerieController.logger.info(`Updating card prints for ${card.id}`);

          if (card.canBeReverse) {
            let reversePrint = await CardAdditionalPrinting.findOne({
              where: {
                cardId: existingCard.id,
                type: CardAdditionalPrintingTypeEnum.REVERSE,
              },
            });

            if (reversePrint) {
              await reversePrint.update({
                type: CardAdditionalPrintingTypeEnum.REVERSE,
                name: 'Reverse',
                creator: CardAdditionalPrintingCreatorEnum.ADMIN,
              });
            } else {
              reversePrint = await CardAdditionalPrinting.create({
                cardId: existingCard.id,
                type: CardAdditionalPrintingTypeEnum.REVERSE,
                name: 'Reverse',
                creator: CardAdditionalPrintingCreatorEnum.ADMIN,
              });
            }
          } else {
            CardAdditionalPrinting.destroy({
              where: {
                cardId: card.id,
                type: CardAdditionalPrintingTypeEnum.REVERSE,
              },
            });
          }

          if (card.canBeFirstEdition) {
            let firstEditionPrint = await CardAdditionalPrinting.findOne({
              where: {
                cardId: existingCard.id,
                type: CardAdditionalPrintingTypeEnum.FIRST_EDITION,
              },
            });

            if (firstEditionPrint) {
              await firstEditionPrint.update({
                type: CardAdditionalPrintingTypeEnum.FIRST_EDITION,
                name: 'First Edition',
                creator: CardAdditionalPrintingCreatorEnum.ADMIN,
              });
            } else {
              firstEditionPrint = await CardAdditionalPrinting.create({
                cardId: existingCard.id,
                type: CardAdditionalPrintingTypeEnum.FIRST_EDITION,
                name: 'First Edition',
                creator: CardAdditionalPrintingCreatorEnum.ADMIN,
              });
            }
          } else {
            CardAdditionalPrinting.destroy({
              where: {
                cardId: card.id,
                type: CardAdditionalPrintingTypeEnum.FIRST_EDITION,
              },
            });
          }
        }
      })(),
      SerieController.logger,
    );

    res.send();
  }

  async importSerieData(
    req: Request<Record<string, never>, void, IImportDataBody>,
    res: Response<IResponse<void>, ILocals>,
  ): Promise<void> {
    req.body = SerieValidation.importData(req.body);

    SerieController.logger.info(`Importing new cards for set ${req.body.id}`);
    const serieId = req.body.id;

    nonBlockingPromise(
      (async () => {
        for (const data of req.body.data) {
          let set;
          set = await CardSet.findOne({
            where: {
              code: data.code,
            },
          });

          if (!set) {
            set = await CardSet.create({
              cardSerieId: serieId,
              code: data.code,
              name: data.name,
              releaseDate: new Date('01/01/1970'),
            });
          } else {
            set.update({
              cardSerieId: serieId,
              code: data.code,
              name: data.name,
              // releaseDate: new Date('01/01/1970'),
            });
          }

          if (!set?.logoId) {
            const image: ArrayBuffer = (
              await axios.get('https://' + data.image.substring(2), {
                responseType: 'arraybuffer',
              })
            ).data as ArrayBuffer;

            if (image) {
              try {
                console.info(`Getting image for ${data.code}`);
                const url = await getPreSignedUrlApplicationFile(
                  {
                    applicationId: process.env.APPLICATION_ID || '',
                  },
                  {
                    type: PreSignUrlType.UPLOAD,
                    fileName: data.code,
                    shouldGeneratePublicAccess: true,
                  },
                );
                console.info(`Uploading image for ${data.code}`);

                const abyssImage = await uploadApplicationFile(
                  {
                    token: url.data.preSignUrl,
                  },
                  {
                    should_skip_await_webhook_delivery: true,
                    should_not_generate_thumbnail: true,
                  },
                  image,
                );

                set.update({
                  logoId: abyssImage.data.applicationFile.publicAccessId ?? '',
                });
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      })(),
      SerieController.logger,
    );

    res.send();
  }
}

export default new SerieController();
