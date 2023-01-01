import {
  CardAdditionalPrintingCreatorEnum,
  CardAdditionalPrintingTypeEnum,
} from './../../../../local-core/enums/card-additional-printing.enum';
import { CardAdditionalPrinting } from './../../database/models/card-additional-printing';
import { CardSet } from '../../database/models/card-set';
import { AdminConfig } from '../../database/models/admin-config';
import {
  AdminConfigTypeEnum,
  CardCategoryEnum,
  CardEnergyTypeEnum,
  CardEvolutionStageEnum,
  CardTrainerTypeEnum,
  IResponseLocals,
} from './../../../../local-core';
import { IResponse } from './../../../../local-core';
import { Request, Response, Router } from 'express';
import { Card, CardSerie } from '../../database';
import admin from '../middlewares/admin';
import axios from 'axios';
import { getTypeEnum, localCardType } from '../utils/get-type-enum-value';
import { getLocalId } from '../utils/get-localid';
import * as fs from 'fs';
import { getRarity } from '../utils/get-rarity';

const route = Router();

export const AdminRouter = (app: Router): Router => {
  app.use('/admin', route);

  route.get(
    '/force-import-data',
    admin,
    async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      //NOCOMMIT
      // sets = [sets[0]];

      const renames = await AdminConfig.findAll({
        where: { type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'] },
      });
      const series = (await axios.get('https://api.tcgdex.net/v2/fr/series')).data;

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

        const sets = serieData.sets;
        // const sets = serieData.sets.filter((set) => set.id === "swsh12");

        for (const set of sets as Array<any>) {
          const setData: any = (await axios.get(`https://api.tcgdex.net/v2/fr/sets/${set.id}`))
            .data;

          console.log(setData.name);

          const realCode = renames.find((rename) => rename.name === setData.id)?.value;

          console.log(realCode);

          if (!realCode) continue;

          const [dbSet] = await CardSet.findOrCreate({
            where: {
              code: realCode,
            },
            defaults: {
              name: setData.name,
              releaseDate: setData.releaseDate,
              cardSerieId: dbSerie.id,
              code: realCode,
            },
          });

          //NOCOMMIT
          // let cardsToIterate = [setData.cards[0]];
          const cardsToIterate = setData.cards;

          const URL = `${setData.symbol}`;
          if (!fs.existsSync(`./img/setIcons/${realCode}.png`)) {
            try {
              const res = await axios.get(URL, {
                responseType: 'arraybuffer',
              });
              if (!res.data) continue;
              if (!fs.existsSync(`./img`)) fs.mkdirSync(`./img`);
              if (!fs.existsSync(`./img/setIcons`)) fs.mkdirSync(`./img/setIcons`);
              fs.writeFileSync(`./img/setIcons/${realCode}.png`, Buffer.from(res.data as any));
            } catch (e) {}
          }

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

            if (dbCard) {
              await dbCard.update({
                name: localCard.name,
                rarity: getRarity(localCard),
                category:
                  CardCategoryEnum[localCard.category as keyof typeof CardCategoryEnum] ?? null,
                hp: localCard.hp ?? null,
                evolveFrom: localCard?.evolveFrom ?? null,
                stage:
                  CardEvolutionStageEnum[localCard.stage as keyof typeof CardEvolutionStageEnum] ??
                  null,
                types:
                  localCard.types?.map((el: localCardType) => {
                    return { type: getTypeEnum(el) };
                  }) ?? [],
                trainerType:
                  CardTrainerTypeEnum[localCard.trainerType as keyof typeof CardTrainerTypeEnum] ??
                  null,
                canBeReverse: localCard.variants?.reverse ?? false,
                isHolo: localCard.variants?.holo ?? false,
                localId: getLocalId(localCard.localId),
                energyType:
                  CardEnergyTypeEnum[localCard.energyType as keyof typeof CardEnergyTypeEnum] ??
                  null,
                setId: dbSet.id,
              });
            } else {
              dbCard = await Card.create({
                name: localCard.name,
                rarity: getRarity(localCard),
                category:
                  CardCategoryEnum[localCard.category as keyof typeof CardCategoryEnum] ?? null,
                hp: localCard.hp ?? null,
                evolveFrom: localCard?.evolveFrom ?? null,
                stage:
                  CardEvolutionStageEnum[localCard.stage as keyof typeof CardEvolutionStageEnum] ??
                  null,
                types:
                  localCard.types?.map((el: localCardType) => {
                    return { type: getTypeEnum(el) };
                  }) ?? [],
                trainerType:
                  CardTrainerTypeEnum[localCard.trainerType as keyof typeof CardTrainerTypeEnum] ??
                  null,
                canBeReverse: localCard.variants?.reverse ?? false,
                isHolo: localCard.variants?.holo ?? false,
                localId: getLocalId(localCard.localId),
                energyType:
                  CardEnergyTypeEnum[localCard.energyType as keyof typeof CardEnergyTypeEnum] ??
                  null,
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

            // let URL = `${localCard.image}/low.jpg`;
            // if (!fs.existsSync(`./img/cards/${realCode}/${getLocalId(localCard.localId)}.jpg`)) {
            //   try {
            //     const res = await axios.get(URL, {
            //       responseType: 'arraybuffer',
            //     });
            //     if (!res.data) continue;
            //     if (!fs.existsSync(`./img`)) fs.mkdirSync(`./img`);
            //     if (!fs.existsSync(`./img/cards`)) fs.mkdirSync(`./img/cards`);
            //     if (!fs.existsSync(`./img/cards/${realCode}`))
            //       fs.mkdirSync(`./img/cards/${realCode}`);
            //     fs.writeFileSync(
            //       `./img/cards/${realCode}/${getLocalId(localCard.localId)}.jpg`,
            //       Buffer.from(res.data as any),
            //     );
            //   } catch (e) {}
            // }

            // URL = `${localCard.image}/high.jpg`;
            // if (!fs.existsSync(`./img/${realCode}/${getLocalId(localCard.localId)}-high.jpg`)) {
            //   try {
            //     const res = await axios.get(URL, {
            //       responseType: 'arraybuffer',
            //     });
            //     if (!res.data) continue;
            //     fs.writeFileSync(
            //       `./img/cards/${realCode}/${getLocalId(localCard.localId)}-high.jpg`,
            //       Buffer.from(res.data as any),
            //     );
            //   } catch (e) {
            //     continue;
            //   }
            // }
          }
        }
      }

      res.json({
        data: 'a',
      });
    },
  );

  route.get(
    '/dataImportSetRename',
    admin,
    async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      const response = await AdminConfig.findAll({
        where: { type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'] },
        order: ['name'],
      });

      res.json({
        data: response,
      });
    },
  );

  route.post(
    '/dataImportSetRename',
    admin,
    async (
      req: Request<any, any, { name: string; value: string; id?: string }>,
      res: Response<IResponse<any>, IResponseLocals>,
    ) => {
      try {
        const existing = await AdminConfig.upsert({
          ...(req.body?.id ? { id: req.body.id } : {}),
          name: req.body.name,
          value: req.body.value,
          type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'],
        });

        res.json({
          data: existing,
        });
      } catch (e) {
        res.json({
          error: {
            code: 'UNKNOWN',
          },
        });
      }
    },
  );

  route.delete(
    '/dataImportSetRename',
    admin,
    async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      try {
        const existing = await AdminConfig.destroy({
          where: { id: req.query.id as string },
        });

        res.json({
          data: existing,
        });
      } catch (e) {
        res.json({
          error: {
            code: 'UNKNOWN',
          },
        });
      }
    },
  );

  route.get(
    '/import-test-data',
    admin,
    async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      //NOCOMMIT
      // sets = [sets[0]];
      try {
        const renames = await AdminConfig.findAll({
          where: { type: AdminConfigTypeEnum['DATA_IMPORT_SET_RENAME'] },
        });
        const series = (
          (await axios.get('https://api.tcgdex.net/v2/fr/series')).data as any[]
        ).filter((serie: any) => serie.id === 'swsh');
        console.log(series);

        for (const serie of series as Array<any>) {
          const serieData: any = (
            await axios.get(`https://api.tcgdex.net/v2/fr/series/${serie.id}`)
          ).data;

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

          const sets = serieData.sets.filter((set: any) => set.id === 'swsh12');

          for (const set of sets as Array<any>) {
            const setData: any = (await axios.get(`https://api.tcgdex.net/v2/fr/sets/${set.id}`))
              .data;

            console.log(setData.name);

            let realCode = renames.find((rename) => rename.name === setData.id)?.value;

            console.log(realCode);

            if (!realCode) realCode = setData.id;

            const [dbSet] = await CardSet.findOrCreate({
              where: {
                code: realCode,
              },
              defaults: {
                name: setData.name,
                releaseDate: setData.releaseDate,
                cardSerieId: dbSerie.id,
                code: realCode,
              },
            });

            const cardsToIterate = setData.cards;

            const URL = `${setData.symbol}`;
            if (!fs.existsSync(`./img/setIcons/${realCode}.png`)) {
              try {
                const res = await axios.get(URL, {
                  responseType: 'arraybuffer',
                });
                if (!res.data) continue;
                if (!fs.existsSync(`./img`)) fs.mkdirSync(`./img`);
                if (!fs.existsSync(`./img/setIcons`)) fs.mkdirSync(`./img/setIcons`);
                fs.writeFileSync(`./img/setIcons/${realCode}.png`, Buffer.from(res.data as any));
              } catch (e) {}
            }

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
                  hp: localCard.hp ?? null,
                  evolveFrom: localCard?.evolveFrom ?? null,
                  stage:
                    CardEvolutionStageEnum[
                      localCard.stage as keyof typeof CardEvolutionStageEnum
                    ] ?? null,
                  types:
                    localCard.types?.map((el: localCardType) => {
                      return { type: getTypeEnum(el) };
                    }) ?? [],
                  trainerType:
                    CardTrainerTypeEnum[
                      localCard.trainerType as keyof typeof CardTrainerTypeEnum
                    ] ?? null,
                  canBeReverse: localCard.variants?.reverse ?? false,
                  isHolo: localCard.variants?.holo ?? false,
                  localId: getLocalId(localCard.localId),
                  energyType:
                    CardEnergyTypeEnum[localCard.energyType as keyof typeof CardEnergyTypeEnum] ??
                    null,
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

              let URL = `${localCard.image}/low.jpg`;
              if (!fs.existsSync(`./img/cards/${realCode}/${getLocalId(localCard.localId)}.jpg`)) {
                try {
                  const res = await axios.get(URL, {
                    responseType: 'arraybuffer',
                  });
                  if (!res.data) continue;
                  if (!fs.existsSync(`./img`)) fs.mkdirSync(`./img`);
                  if (!fs.existsSync(`./img/cards`)) fs.mkdirSync(`./img/cards`);
                  if (!fs.existsSync(`./img/cards/${realCode}`))
                    fs.mkdirSync(`./img/cards/${realCode}`);
                  fs.writeFileSync(
                    `./img/cards/${realCode}/${getLocalId(localCard.localId)}.jpg`,
                    Buffer.from(res.data as any),
                  );
                } catch (e) {}
              }

              URL = `${localCard.image}/high.jpg`;
              if (!fs.existsSync(`./img/${realCode}/${getLocalId(localCard.localId)}-high.jpg`)) {
                try {
                  const res = await axios.get(URL, {
                    responseType: 'arraybuffer',
                  });
                  if (!res.data) continue;
                  fs.writeFileSync(
                    `./img/cards/${realCode}/${getLocalId(localCard.localId)}-high.jpg`,
                    Buffer.from(res.data as any),
                  );
                } catch (e) {
                  continue;
                }
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }

      res.json({
        data: 'a',
      });
    },
  );

  return route;
};
