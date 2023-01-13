import axios from 'axios';
import {
  AdminConfigTypeEnum,
  CardCategoryEnum,
  CardEvolutionStageEnum,
  CardTrainerTypeEnum,
  CardEnergyTypeEnum,
  CardAdditionalPrintingTypeEnum,
  CardAdditionalPrintingCreatorEnum,
  IForceImportDataAdminResponse,
} from 'vokit_core';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import { CardSerie, CardSet, Card } from '../../database';
import { AdminConfig } from '../../database/models/admin-config.model';
import { CardAdditionalPrinting } from '../../database/models/card-additional-printing.model';
import { getLocalId } from '../../utils/get-localid';
import { getRarity } from '../../utils/get-rarity';
import { localCardType, getTypeEnum } from '../../utils/get-type-enum-value';

class AdminController implements Controller {
  private static readonly logger = new LoggerModel(AdminController.name);

  async forceImportData(
    req: Request<Record<string, never>, IForceImportDataAdminResponse, void>,
    res: Response<IForceImportDataResponse, ILocals>,
  ): Promise<void> {
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
        const setData: any = (await axios.get(`https://api.tcgdex.net/v2/fr/sets/${set.id}`)).data;

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
                CardEnergyTypeEnum[localCard.energyType as keyof typeof CardEnergyTypeEnum] ?? null,
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
                CardEnergyTypeEnum[localCard.energyType as keyof typeof CardEnergyTypeEnum] ?? null,
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
  }
}

export default new AdminController();
