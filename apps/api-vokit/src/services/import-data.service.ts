import { nonBlockingPromise } from './../utils/non-blocking-promise.utils';
import axios from 'axios';
import {
  AdminConfigTypeEnum,
  CardCategoryEnum,
  CardAdditionalPrintingTypeEnum,
  CardAdditionalPrintingCreatorEnum,
} from 'vokit_core';
import { Service } from '../core';
import { CardSerie, CardSet, Card } from '../database';
import { AdminConfig } from '../database/models/admin-config.model';
import { CardAdditionalPrinting } from '../database/models/card-additional-printing.model';
import { getLocalId } from '../utils/get-localid';
import { getRarity } from '../utils/get-rarity';
import { localCardType, getTypeEnum } from '../utils/get-type-enum-value';

export class ImportDataService extends Service {
  public async importData(setList: string[]): Promise<void> {
    const renames = await AdminConfig.findAll({
      where: { type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'] },
    });

    this.logger.log('Import de ' + setList.length + ' nouveaux sets.');

    nonBlockingPromise(
      axios.post(process.env.ASSETS_SERVER_URL as string, {
        ids: setList.map((e) => ({
          id: e,
          name: renames.find((rename) => rename.name === e)?.value ?? e,
        })),
      }),
      this.logger,
    );

    const series: any = (await axios.get('https://api.tcgdex.net/v2/fr/series')).data;

    this.logger.log(`${series.length} series fetched`);

    for (const serie of series as Array<any>) {
      this.logger.log(`Serie ${serie.id}`);
      const serieData: any = (await axios.get(`https://api.tcgdex.net/v2/fr/series/${serie.id}`))
        .data;

      let dbSerie = await CardSerie.findOne({
        where: {
          code: serieData.id,
        },
      });

      if (!dbSerie) {
        dbSerie = await CardSerie.create({
          name: serieData.name,
          code: serieData.id,
        });
      }

      const sets = serieData.sets;

      for (const set of sets as Array<any>) {
        if (!setList.includes(set.id)) continue;
        this.logger.log(`${serie.id} - Set ${set.id}`);

        const setData: any = (await axios.get(`https://api.tcgdex.net/v2/fr/sets/${set.id}`)).data;

        const realCode = renames.find((rename) => rename.name === setData.id)?.value ?? setData.id;

        const [dbSet] = await CardSet.findOrCreate({
          where: {
            code: [realCode, setData.id],
          },
          defaults: {
            name: setData.name,
            releaseDate: setData.releaseDate,
            cardSerieId: dbSerie.id,
            code: realCode,
            cardCount: setData.cardCount,
          },
        });

        if (dbSet.code !== realCode) {
          await dbSet.update('code', realCode);
        }

        const cardsToIterate = setData.cards;

        for (const card of cardsToIterate) {
          this.logger.log(`${serie.id} - ${set.id} - Card ${card.localId}`);

          const localCard: any = (await axios.get(`https://api.tcgdex.net/v2/fr/cards/${card.id}`))
            .data;

          console.log(getLocalId(localCard.localId));

          let dbCard = await Card.findOne({
            where: {
              localId: getLocalId(localCard.localId),
            },
            include: [
              {
                where: { code: realCode },
                model: CardSet,
                required: true,
                duplicating: false,
                as: 'cardSet',
              },
            ],
          });

          if (!dbCard) {
            dbCard = await Card.create({
              name: localCard.name,
              rarity: getRarity(localCard),
              category:
                CardCategoryEnum[localCard.category as keyof typeof CardCategoryEnum] ?? null,
              types:
                localCard.types?.map((el: localCardType) => {
                  return { type: getTypeEnum(el) };
                }) ?? [],
              canBeReverse: localCard.variants?.reverse ?? false,
              localId: getLocalId(localCard.localId),
              setId: dbSet.id,
            });
          }

          if (dbCard.canBeReverse) {
            let reversePrint = await CardAdditionalPrinting.findOne({
              where: {
                cardId: dbCard.id,
                type: CardAdditionalPrintingTypeEnum.REVERSE,
              },
            });

            if (reversePrint) {
              await reversePrint.update({
                cardId: dbCard.id,
                type: CardAdditionalPrintingTypeEnum.REVERSE,
                name: 'Reverse',
                creator: CardAdditionalPrintingCreatorEnum.ADMIN,
              });
            } else {
              reversePrint = await CardAdditionalPrinting.create({
                cardId: dbCard.id,
                type: CardAdditionalPrintingTypeEnum.REVERSE,
                name: 'Reverse',
                creator: CardAdditionalPrintingCreatorEnum.ADMIN,
              });
            }
          }
        }
      }
    }
  }

  public async importTestData(): Promise<void> {
    try {
      const renames = await AdminConfig.findAll({
        where: { type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'] },
      });
      const series = (
        (await axios.get('https://api.tcgdex.net/v2/fr/series')).data as any[]
      ).filter((serie: any) => serie.id === 'swsh');

      for (const serie of series as Array<any>) {
        const serieData: any = (await axios.get(`https://api.tcgdex.net/v2/fr/series/${serie.id}`))
          .data;

        let dbSerie = await CardSerie.findOne({
          where: {
            code: serieData.id,
          },
        });

        if (!dbSerie) {
          dbSerie = await CardSerie.create({
            name: serieData.name,
            code: serieData.id,
          });
        }

        const sets = serieData.sets.filter(
          (set: any) => set.id === 'swsh12' || set.id === 'swsh11',
        );

        for (const set of sets as Array<any>) {
          const setData: any = (await axios.get(`https://api.tcgdex.net/v2/fr/sets/${set.id}`))
            .data;

          console.log(setData.name);

          let realCode = renames.find((rename) => rename.name === setData.id)?.value;

          if (!realCode) realCode = setData.id;

          const [dbSet] = await CardSet.findOrCreate({
            where: {
              code: realCode,
            },
            defaults: {
              name: setData.name,
              releaseDate: setData.releaseDate,
              cardSerieId: dbSerie.id,
              code: realCode as string,
              cardCount: setData.cardCount,
            },
          });

          const cardsToIterate = setData.cards;

          for (const card of cardsToIterate) {
            const localCard: any = (
              await axios.get(`https://api.tcgdex.net/v2/fr/cards/${card.id}`)
            ).data;

            console.log(getLocalId(localCard.localId));

            let dbCard = await Card.findOne({
              where: {
                localId: getLocalId(localCard.localId),
              },
              include: [
                {
                  where: { code: realCode },
                  model: CardSet,
                  required: true,
                  duplicating: false,
                  as: 'cardSet',
                },
              ],
            });

            if (!dbCard) {
              dbCard = await Card.create({
                name: localCard.name,
                rarity: getRarity(localCard),
                category:
                  CardCategoryEnum[localCard.category as keyof typeof CardCategoryEnum] ?? null,
                types:
                  localCard.types?.map((el: localCardType) => {
                    return { type: getTypeEnum(el) };
                  }) ?? [],
                canBeReverse: localCard.variants?.reverse ?? false,
                localId: getLocalId(localCard.localId),
                setId: dbSet.id,
              });

              if (dbCard.canBeReverse) {
                await CardAdditionalPrinting.create({
                  cardId: dbCard.id,
                  type: CardAdditionalPrintingTypeEnum.REVERSE,
                  name: 'Reverse',
                  creator: CardAdditionalPrintingCreatorEnum.ADMIN,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ImportDataService();
