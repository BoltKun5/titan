import {
  CardAttributeEnum,
  CardDamageModificationType,
  CardTypeEnum,
  CardEnergyTypeEnum,
  HeldItemType,
  CardTrainerTypeEnum,
  CardEvolutionStageEnum,
  CardCategoryEnum,
  CardRarityEnum,
  CardCountType,
  CardAbilityTypeEnum
} from "./local_core";
import { existsSync, readdirSync, statSync } from "fs-extra";
import { LogType } from "abyss_crypt_core";
import { startServer } from "./app";
import AppConfig from "./modules/AppConfig";
import Logger from "./modules/Logger";
import path from "path";
import { CardDamageModification } from "./database/models/CardDamageModification";
import { CardAbility } from "./database/models/CardAbility";
import { CardAttackCost } from "./database/models/CardAttackCost";
import { Card, CardAttack, CardAttribute, CardSerie, CardSet } from "./database";
import { CardType } from "./database/models/CardType";
import { CardDexId } from "./database/models/CardDexId";

(async () => {
  try {
    AppConfig.consoleSetup();
    await startServer();

    setTimeout(test, 1);
  } catch (error) {
    Logger.error(error, LogType.SYSTEM_STARTUP);
  }
})();

function getTypeEnum(type) {
  if (type === "Lightning")
    return CardTypeEnum.ELECTRIC;
  return CardTypeEnum[type.toUpperCase()] ?? null;
}

function getLocalId(baseId) {
  if (/^\d+$/.test(baseId) && baseId.length < 3) {
    if (baseId.length === 1) return "00" + baseId;
    if (baseId.length === 2) return "0" + baseId;
  }
  return baseId
}

let count = 0;
process.on("unhandledRejection", (error) => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection", error);
});

async function test() {
  try {
    console.time("seed");
    const series: {
      name: string,
      code: string,
      cardSets: {
        name: string,
        cardCount: CardCountType,
        tcgOnline: string,
        isPlayableInStandard: boolean,
        isPlayableInExpanded: boolean,
        code: string,
        cards: {
          name: string,
          rarity: CardRarityEnum,
          category: CardCategoryEnum,
          hp: number,
          evolveFrom: string,
          stage: CardEvolutionStageEnum,
          types: {
            type: CardTypeEnum
          }[],
          attacks: {
            costs: {
              cost: number,
              type: CardTypeEnum
            }[],
            name: string,
            effect: string,
            damage: string
          }[],
          abilities: {
            name: string,
            effect: string,
            type: CardAbilityTypeEnum
          }[],
          effect: string,
          damageModifications: {
            modificationType: CardDamageModificationType,
            type: CardTypeEnum,
            value: string
          }[],
          retreat: number,
          regulationMark: string,
          trainerType: CardTrainerTypeEnum,
          canBeNormal: boolean,
          canBeReverse: boolean,
          isHolo: boolean,
          isFirstEdition: boolean,
          attributes: {
            attribute: CardAttributeEnum
          }[],
          localId: string,
          dexIds: {
            dexId: string
          }[],
          description: string,
          level: string,
          item: HeldItemType,
          energyType: CardEnergyTypeEnum
        }[],
        releaseDate: Date
      }[]
    }[] = [];

    const process = async (localPath: string, deep: number, index = -1, serieIndex = -1) => {

      // console.log(localPath, deep, index, serieIndex)

      if (!existsSync("./src" + localPath))
        return;

      const src = readdirSync("./src" + localPath);

      // await Promise.all(

      for (const fileName of src) {
        // console.log(fileName)

        const currentFilePath = path.join(localPath, fileName);
        const stats = statSync("./src" + currentFilePath);
        const nextFolderPath = localPath + "/" + fileName.split(".")[0];
        let newIndex: number;

        if (stats.isFile()) {
          if (deep === 1 && fileName !== "Sword & Shield.ts") {
            continue;
          }

          // if (deep === 2 && fileName !== "Chilling Reign.ts") return
          // if (deep === 3 && fileName !== "9.ts") {
          //   return
          // }
          // if (deep === 3) console.log(`Start loading ${localPath}/${fileName.split('.')[0]}`)
          const file = await import(`.${localPath}/${fileName.split(".")[0]}`);
          // if (deep === 3) console.log(`File loaded`)
          // console.log(file)

          if (deep !== 1 && index !== -1) {

            if (deep === 2) {
              newIndex = series[index - 1].cardSets.push({
                name: file.default.name.fr ?? file.default.name.en,
                cardCount: file.default?.cardCount ?? null,
                tcgOnline: file.default?.tcgOnline ?? null,
                releaseDate: file.default?.releaseDate ?? null,
                isPlayableInStandard: false,
                isPlayableInExpanded: false,
                cards: [],
                code: file.default.id
              });

            } else {
              const damageModifications = [];
              file.default?.weaknesses?.forEach((el) => {
                damageModifications.push({
                  modificationType: CardDamageModificationType.weakness,
                  type: getTypeEnum(el.type),
                  value: el.value
                });
              });
              file.default?.resistances?.forEach((el) => {
                damageModifications.push({
                  modificationType: CardDamageModificationType.weakness,
                  type: getTypeEnum(el.type),
                  value: el.value
                });
              });
              newIndex = series[serieIndex - 1].cardSets[index - 1].cards.push({
                name: file.default.name.fr ?? file.default.name.en,
                rarity: CardRarityEnum[file.default?.rarity] ?? null,
                category: CardCategoryEnum[file.default?.category] ?? null,
                hp: file.default?.hp ?? null,
                evolveFrom: file.default?.evolveFrom?.fr ?? null,
                stage: CardEvolutionStageEnum[file.default?.stage] ?? null,
                types: file.default?.types?.map((el) => {
                  return { type: getTypeEnum(el) };
                }) ?? [],
                attacks: file.default?.attacks?.map((el) => {
                  const costs = [];
                  const calculatedCosts = [];
                  el?.cost?.forEach((costName) => {
                    if (calculatedCosts.includes(costName)) return;
                    costs.push({
                      type: getTypeEnum(costName),
                      cost: el?.cost.filter(x => x === costName).length
                    });
                    calculatedCosts.push(costName);
                  });
                  return {
                    name: el?.name?.fr ?? el?.name?.en,
                    effect: el?.effect?.fr ?? null,
                    damage: el?.damage ?? null,
                    costs: costs
                  };
                }) ?? [],
                abilities: file.default?.abilities?.map((el) => {
                  return {
                    name: el.name?.fr ?? el.name.en,
                    effect: el.effect?.fr ?? el.effect.en,
                    type: CardAbilityTypeEnum[el.type] ?? null
                  };
                }) ?? [],
                effect: file.default?.effect?.fr ?? null,
                damageModifications: damageModifications ?? null,
                retreat: file.default?.retreat ?? null,
                regulationMark: file.default?.regulationMark ?? null,
                trainerType: CardTrainerTypeEnum[file.default?.trainerType] ?? null,
                canBeNormal: file.default?.variants?.normal ?? false,
                canBeReverse: file.default?.variants?.reverse ?? false,
                isHolo: file.default?.variants?.holo ?? false,
                isFirstEdition: file.default?.variants?.firstEdition ?? false,
                attributes: file.default.suffix ? [{ attribute: file.default.suffix }] : [],
                localId: getLocalId(fileName.split(".")[0]),
                dexIds: file.default?.dexIds?.map((el) => ({ dexId: el.toString() })) ?? [],
                description: file.default?.desc ?? null,
                level: file.default?.level ?? null,
                item: file.default?.item ?? null,
                energyType: CardEnergyTypeEnum[file.default?.energyType] ?? null

              } as any);
              count++;
              if (count % 10 === 0) console.log(count);

            }
          } else {

            newIndex = series.push({ name: file.default.name.fr ?? file.default.name.en, cardSets: [], code: file.default.id });

          }

          if (deep == 2)
            await process(nextFolderPath, (deep + 1), newIndex, index);
          else if (deep !== 3)
            await process(nextFolderPath, (deep + 1), newIndex);
        }
      }
      // )
    };

    await process('/data', 1);

    const [createdCardSeries, createdSets, createCards] = await Promise.all([
      await CardSerie.findAll(),
      await CardSet.findAll(),
      await Card.findAll()])

    const c1 = createdCardSeries.map(el => el.name);
    const c2 = createdSets.map(el => el.name);
    const c3 = createCards.map(el => el.cardSet.cardSerie.name + el.cardSet.name + el.localId)

    await Promise.all(
      series.filter((el) => !c1.includes(el.name)).map(async (serie) => {
        const currentSerie = await CardSerie.create(serie);

        await Promise.all(serie.cardSets.filter(el => !c2.includes(el.name)).map(async (cardSet) => {
          const currentCardSet = await CardSet.create(cardSet);
          await currentCardSet.$set("cardSerie", currentSerie);

          await Promise.all(cardSet.cards.filter(el => !c3.includes(serie.name + cardSet.name + el.localId)).map(async (card) => {
            const currentCard = await Card.create(card, {
              include: [
                {
                  model: CardType,
                  as: "types"
                },
                {
                  model: CardAttack,
                  as: "attacks",
                  include: [{
                    model: CardAttackCost,
                    as: "costs"
                  }]
                },
                {
                  model: CardAbility,
                  as: "abilities"
                },
                {
                  model: CardDamageModification,
                  as: "damageModifications"
                },
                {
                  model: CardAttribute,
                  as: "attributes"
                },
                {
                  model: CardDexId,
                  as: "dexIds"
                }
              ]
            });
            await currentCard.$set("cardSet", currentCardSet);
          }));
        }));
      })
    );

    console.timeEnd("seed");
  } catch (error) {
    console.error(error);
    Logger.error(error, LogType.SYSTEM_STARTUP);
  }
}
