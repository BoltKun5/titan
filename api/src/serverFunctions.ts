import axios from "axios";
import * as fs from "fs";
import api from "./config/api";
import { response } from "express";
import { replace, split } from "lodash";

import { Card, CardAttack, CardAttribute, CardSerie, CardSet } from "./database";
import { CardType } from "./database/models/CardType";
import { CardAttackCost } from "./database/models/CardAttackCost";
import { CardAbility } from "./database/models/CardAbility";
import { CardDamageModification } from "./database/models/CardDamageModification";
import { CardDexId } from "./database/models/CardDexId";
import { CardCountType, HeldItemType } from "../../local-core/types";
import { CardAbilityTypeEnum, CardAttributeEnum, CardCategoryEnum, CardDamageModificationType, CardEnergyTypeEnum, CardEvolutionStageEnum, CardRarityEnum, CardTrainerTypeEnum, CardTypeEnum } from "../../local-core/enums";

export const getSetIcons = async () => {
  for (let set of aze) {
    let name = set;
    if (promoArray.includes(set)) {
      set = 'PROMO'
    }
    try {
      const res = await axios.get('https://www.pokecardex.com/assets/images/symboles/' + set + '.png', {
        responseType: 'arraybuffer',
      });
      if (!fs.existsSync(`./img`))
        fs.mkdirSync(`./img`)
      if (!fs.existsSync(`./img/setIcons`))
        fs.mkdirSync(`./img/setIcons`)
      fs.writeFileSync(`./img/setIcons/${name}.png`, Buffer.from(res.data as any));
      console.log(set)
    } catch (e) {
      continue;
    }
  }
}

export const promoArray = [
  "CP22",
  "CP10",
  "LMN6",
  "LMN5",
  "PRWC",
  "PRNI",
  "PRDP",
  "PRHS",
  "PRBW",
  "PRXY",
  "PRSM",
  "PRSWSH"
]

export const renamePokecardexSetIcons = async () => {
  for (const [key, value] of Object.entries(fullSetList)) {
    try {
      fs.renameSync(`./img/setIcons/${value}.png`, `./img/setIcons/${key}.png`);
      console.log(value)
    } catch (e) {
      console.log(e)
    }
  }
}



export const renameImages = (setCode: string, startIndex: number, endIndex: number, newNamePrefix: string) => {
  if (!fs.existsSync(`./img`))
    fs.mkdirSync(`./img`)

  for (let i = startIndex; i <= endIndex; i++) {
    try {
      fs.renameSync(`./img/${setCode}/${i}.jpg`, `./img/${setCode}/${newNamePrefix}${String(i - 186).padStart(2, "0")}.jpg`);
    } catch (e) {
      console.log(e)
    }
  }
}

export const getAllCardImg = async () => {
  const myArray = fullSetList;
  for (const [key, value] of Object.entries(myArray)) {

    for (let i = 1; i <= 300; i++) {
      const URL = `https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/${key}/${key}_${String(i).padStart(3, "0")}_R_FR_LG.png`;
      try {
        if (fs.existsSync(`./img/${key}/${i}.jpg`)) {
          continue
        }
        const res = await axios.get(URL, {
          responseType: 'arraybuffer',
        });
        if (!res.data) continue
        if (!fs.existsSync(`./img/${key}`))
          fs.mkdirSync(`./img/${key}`)
        fs.writeFileSync(`./img/${key}/${i}.jpg`, Buffer.from(res.data as any));
        console.log(i)
      } catch (e) {
        // console.log(URL)
        continue
      }


    }
  }
}

export const getAllTGCardImg = async () => {
  const myArray = fullSetList;
  for (const [key, value] of Object.entries(myArray)) {

    for (let i = 1; i <= 100; i++) {
      const URL = `https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/${key}/${key}_TG${i}_R_FR_LG.png`;
      try {
        // if (fs.existsSync(`./img/${key}/${i}.jpg`)) {
        //   continue
        // }
        const res = await axios.get(URL, {
          responseType: 'arraybuffer',
        });
        if (!res.data) continue
        if (!fs.existsSync(`./img/${key}`))
          fs.mkdirSync(`./img/${key}`)
        fs.writeFileSync(`./img/${key}/TG${String(i).padStart(2, "0")}.jpg`, Buffer.from(res.data as any));
        console.log(i)
      } catch (e) {
        // console.log(URL)
        continue
      }


    }
  }
}

export const getDataFromLimitless = async () => {
  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;
  const response = await axios.get("https://limitlesstcg.com/cards/en?q=%21set%3ASSP+Kleavor+VStar&show=100", {
    headers: {
      Cookie: "cards_display=full",
    },
  });
  const dom = new JSDOM(response.data);
  const cardSet = await CardSet.findOne({
    where: {
      code: 'SSP',
    },
  })
  // await Card.destroy({
  //   where: {
  //     setId: cardSet.id
  //   }
  // })
  dom.window.document.querySelectorAll('.card-page-main').forEach(async (el, index) => {
    const data = el.querySelector('.card-details-main');

    const set = el.querySelector(".prints-current-details span").textContent.split("(")[1];
    set.replace(")", "")
    let localId = el.querySelector(".prints-current-details span:last-of-type").textContent.split(" · ")[0].replace("#", "").replace("\n", "")
    localId = localId.substring(20)
    localId = localId.substring(0, localId.length - 17)
    localId = localId.padStart(3, "0")
    console.log(localId)
    const name = data.querySelector('.card-text-name').textContent;

    const type = split(data.querySelector('.card-text-type').textContent, " - ")

    let title, pkmnType, hp, stage, evolveFrom, effect, weakness, resistance, retreat, trainerType, energyType, ability,
      abilityName, attacks

    let category = 0;
    if (type[0].includes("Pokémon")) {
      category = 2;
    }
    if (type[0].includes("Trainer")) {
      category = 3;
    }
    if (type[0].includes("Energy")) {
      category = 1;
    }
    const rarity = el.querySelectorAll(".prints-current-details span")?.[1]?.textContent?.split(" · ")[1]?.split('\n')[0] ?? "None";

    if (category === 2) {
      title = data.querySelector('.card-text-title').textContent.split(" - ");
      pkmnType = title[1].substring(0, title[1].indexOf('\n'));
      hp = title[2].substring(0, title[2].indexOf(' '));
      stage = type[1].split("\n")[0];
      evolveFrom = type?.[2]?.split("\n")[1].replace("                ", "") ?? "";
      let wrrData = data.querySelector(".card-text-wrr");
      wrrData = wrrData.textContent.split("\n");

      retreat = wrrData[3].replace("                ", "").replace("Retreat: ", "");

      ability = el.querySelector(".card-text-ability-info")?.textContent;
      if (ability) {
        abilityName = ability.replace("Ability:", "")
        abilityName = abilityName.replace("\n", "")
        abilityName = abilityName.substring(51)

        ability = el.querySelector(".card-text-ability-effect").textContent;
      }

      attacks = [];
      el.querySelectorAll(".card-text-attack").forEach((attackEl) => {
        let attack = attackEl.textContent;
        attack = attack.split("\n");
        let cost = attack[2].substring(8)
        cost = cost.split("");
        cost = cost.map((e) => {
          switch (e) {
            case "N":
              return "DRAGON";
            case "G":
              return "GRASS";
            case "R":
              return "FIRE";
            case "W":
              return "WATER";
            case "F":
              return "FIGHTING";
            case "P":
              return "PSYCHIC";
            case "C":
              return "COLORLESS";
            case "D":
              return "DARKNESS"
            case "M":
              return "METAL";
            case "L":
              return "ELECTRIC";
            default:
              return "NONE";
          }
        })

        let name = attack[3].substring(8)
        let damage = name.split(' ').pop()
        name = name.split(' ');
        let finalName = "";
        name = name.forEach((el, index) => {
          if (index !== name.length - 1) {
            finalName += (index === 0 ? '' : ' ') + el
          }
        })

        let effect = attackEl.querySelector(".card-text-attack-effect").textContent.substring(10);

        attacks.push({
          cost,
          name: {
            fr: name,
          },
          effect: {
            fr: effect,
          },
          damage,
        })
      })
    }

    if (category === 3) {
      if (type[1].includes("Supporter")) {
        trainerType = 1;
      }
      if (type[1].includes("Stadium")) {
        trainerType = 2;
      }
      if (type[1].includes("Item")) {
        if (type[2]?.includes("Tool")) {
          trainerType = 4;
        } else {
          trainerType = 3
        }
      }

      effect = data.querySelectorAll(".card-text-section")[1].textContent
    }

    if (category === 1) {
      energyType = type[1];
    }

    const final = {
      name,
      rarity: 3,
      category,
      hp: hp ?? null,
      evolveFrom: evolveFrom ?? null,
      stage: CardEvolutionStageEnum[stage] ?? null,
      types: pkmnType ? [getTypeEnum(pkmnType)] : [],
      attacks: attacks?.map((el) => {
        const costs = [];
        const calculatedCosts = [];
        el?.cost?.forEach((costName, index) => {
          if (calculatedCosts.includes(costName)) return;
          costs.push({
            type: getTypeEnum(costName),
            cost: el?.cost.filter(x => x === costName).length,
          });
          calculatedCosts.push(costName);
        });
        return {
          name: el?.name?.fr ?? el?.name?.en,
          effect: el?.effect?.fr ?? null,
          damage: el?.damage ?? null,
          costs: costs,
        };
      }) ?? [],
      abilities: ability ? [{
        name: abilityName,
        effect: ability,
        type: 3,
      }] : [],
      effect: effect ?? null,
      damageModifications: [],
      regulationMark: null,
      trainerType: trainerType ?? null,
      canBeNormal: true,
      canBeReverse: false,
      isHolo: false,
      isFirstEdition: false,
      attributes: [],
      localId: removeLastSpace(localId.padStart(3, "0")),
      dexIds: [],
      description: null,
      level: null,
      item: null,
      energyType: energyType ?? null,
      cardSet,
    }

    const currentCard = await Card.create(final, {
      include: [
        {
          model: CardType,
          as: "types",
        },
        {
          model: CardAttack,
          as: "attacks",
          include: [{
            model: CardAttackCost,
            as: "costs",
          }],
        },
        {
          model: CardAbility,
          as: "abilities",
        },
        {
          model: CardDamageModification,
          as: "damageModifications",
        },
        {
          model: CardAttribute,
          as: "attributes",
        },
        {
          model: CardDexId,
          as: "dexIds",
        },
      ],
    });
    await currentCard.$set("cardSet", cardSet);
  })
}

const removeLastSpace = (string) => {
  if (string.slice(-1) === " ") {
    return string.substring(0, string.length - 1)
  }
  return string
}

function getTypeEnum(type) {
  if (type === "Lightning")
    return CardTypeEnum.ELECTRIC;
  return CardTypeEnum[type.toUpperCase()] ?? null;
}

export async function changeAze() {
  const myArray = fullSetList;
  for (const [key, value] of Object.entries(myArray)) {

    // let i = 1;
    // while (fs.existsSync(`./cards/${key}/${i}.png`)) {
    //   fs.copyFileSync(`./cards/${key}/${i}.png`, `./cards/${key}/${i}.jpg`);
    //   i++
    // }

    for (let i = 1; i <= 250; i++) {
      const URL = `https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/${key}/${key}_${String(i).padStart(3, "0")}_R_FR_LG.png`;
      try {
        const res = await axios.get(URL, {
          responseType: 'arraybuffer',
        });
        if (!res.data) continue
        if (!fs.existsSync(`./img/${key}`))
          fs.mkdirSync(`./img/${key}`)
        fs.writeFileSync(`./img/${key}/${i}.jpg`, Buffer.from(res.data as any));
        console.log(i)
      } catch (e) {
        console.log(URL)
      }


    }
  }
}

export function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  // @ts-ignore
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export async function sleep(duration): Promise<void> {
  new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, duration)
  })
}

export function getLocalId(baseId) {
  if (/^\d+$/.test(baseId) && baseId.length < 3) {
    if (baseId.length === 1) return "00" + baseId;
    if (baseId.length === 2) return "0" + baseId;
  }
  return baseId
}

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

// const process = async (localPath: string, deep: number, index = -1, serieIndex = -1) => {

//   console.log(localPath, deep, index, serieIndex)

//   if (!existsSync("./src" + localPath))
//     return;

//   const src = readdirSync("./src" + localPath);

//   // await Promise.all(

//   for (const fileName of src) {
//     console.log(fileName)

//     const currentFilePath = path.join(localPath, fileName);
//     const stats = statSync("./src" + currentFilePath);
//     const nextFolderPath = localPath + "/" + fileName.split(".")[0];
//     let newIndex: number;

//     if (stats.isFile()) {
//       // if (deep === 1 && fileName !== "XY.ts") {
//       //   continue;
//       // }

//       // if (deep === 2 && fileName !== "Chilling Reign.ts") return
//       // if (deep === 3 && fileName !== "9.ts") {
//       //   return
//       // }
//       // if (deep === 3) console.log(`Start loading ${localPath}/${fileName.split('.')[0]}`)
//       const file = await import(`.${localPath}/${fileName.split(".")[0]}`);
//       // if (deep === 3) console.log(`File loaded`)
//       // console.log(file)

//       if (deep !== 1 && index !== -1) {

//         if (deep === 2) {
//           newIndex = series[index - 1].cardSets.push({
//             name: file.default.name.fr ?? file.default.name.en,
//             cardCount: file.default?.cardCount ?? null,
//             tcgOnline: file.default?.tcgOnline ?? null,
//             releaseDate: file.default?.releaseDate ?? null,
//             isPlayableInStandard: false,
//             isPlayableInExpanded: false,
//             cards: [],
//             code: file.default.id,
//           });

//         } else {
//           const damageModifications = [];
//           file.default?.weaknesses?.forEach((el) => {
//             damageModifications.push({
//               modificationType: CardWeaknessType.weakness,
//               type: getTypeEnum(el.type),
//               value: el.value,
//             });
//           });
//           file.default?.resistances?.forEach((el) => {
//             damageModifications.push({
//               modificationType: CardDamageModificationType.weakness,
//               type: getTypeEnum(el.type),
//               value: el.value,
//             });
//           });
//           newIndex = series[serieIndex - 1].cardSets[index - 1].cards.push({
//             name: file.default.name.fr ?? file.default.name.en,
//             rarity: CardRarityEnum[file.default?.rarity] ?? null,
//             category: CardCategoryEnum[file.default?.category] ?? null,
//             hp: file.default?.hp ?? null,
//             evolveFrom: file.default?.evolveFrom?.fr ?? null,
//             stage: CardEvolutionStageEnum[file.default?.stage] ?? null,
//             types: file.default?.types?.map((el) => {
//               return { type: getTypeEnum(el) };
//             }) ?? [],
//             attacks: file.default?.attacks?.map((el) => {
//               const costs = [];
//               const calculatedCosts = [];
//               el?.cost?.forEach((costName) => {
//                 if (calculatedCosts.includes(costName)) return;
//                 costs.push({
//                   type: getTypeEnum(costName),
//                   cost: el?.cost.filter(x => x === costName).length,
//                 });
//                 calculatedCosts.push(costName);
//               });
//               return {
//                 name: el?.name?.fr ?? el?.name?.en,
//                 effect: el?.effect?.fr ?? null,
//                 damage: el?.damage ?? null,
//                 costs: costs,
//               };
//             }) ?? [],
//             abilities: file.default?.abilities?.map((el) => {
//               return {
//                 name: el.name?.fr ?? el.name.en,
//                 effect: el.effect?.fr ?? el.effect.en,
//                 type: CardAbilityTypeEnum[el.type] ?? null,
//               };
//             }) ?? [],
//             effect: file.default?.effect?.fr ?? null,
//             damageModifications: damageModifications ?? null,
//             retreat: file.default?.retreat ?? null,
//             regulationMark: file.default?.regulationMark ?? null,
//             trainerType: CardTrainerTypeEnum[file.default?.trainerType] ?? null,
//             canBeNormal: file.default?.variants?.normal ?? false,
//             canBeReverse: file.default?.variants?.reverse ?? false,
//             isHolo: file.default?.variants?.holo ?? false,
//             isFirstEdition: file.default?.variants?.firstEdition ?? false,
//             attributes: file.default.suffix ? [{ attribute: file.default.suffix }] : [],
//             localId: getLocalId(fileName.split(".")[0]),
//             dexIds: file.default?.dexIds?.map((el) => ({ dexId: el.toString() })) ?? [],
//             description: file.default?.desc ?? null,
//             level: file.default?.level ?? null,
//             item: file.default?.item ?? null,
//             energyType: CardEnergyTypeEnum[file.default?.energyType] ?? null,

//           } as any);
//           count++;
//           if (count % 10 === 0) console.log(count);

//         }
//       } else {

//         newIndex = series.push({
//           name: file.default.name.fr ?? file.default.name.en,
//           cardSets: [],
//           code: file.default.id,
//         });

//       }

//       if (deep == 2)
//         await process(nextFolderPath, (deep + 1), newIndex, index);
//       else if (deep !== 3)
//         await process(nextFolderPath, (deep + 1), newIndex);
//     }
//   }
//   // )
// };

// await process('/data', 1);

// const [createdCardSeries, createdSets, createCards] = await Promise.all([
//   await CardSerie.findAll(),
//   await CardSet.findAll(),
//   await Card.findAll()])

// const c1 = createdCardSeries.map(el => el.name);
// const c2 = createdSets.map(el => el.name);
// const c3 = createCards.map(el => el?.cardSet?.cardSerie?.name + el?.cardSet?.name + el.localId)
console.log(series)
// await Promise.all(
//   series.map(async (serie) => {
//     // const currentSerie = await CardSerie.create(serie);
//     const currentSerie = await CardSerie.findOne({
//       where: {
//         name: "Épée et Bouclier",
//       },
//     })
//     await Promise.all(serie.cardSets.map(async (cardSet) => {
//       const currentCardSet = await CardSet.create(cardSet);
//       await currentCardSet.$set("cardSerie", currentSerie);

//       await Promise.all(cardSet.cards.map(async (card) => {
//         const currentCard = await Card.create(card, {
//           include: [
//             {
//               model: CardType,
//               as: "types",
//             },
//             {
//               model: CardAttack,
//               as: "attacks",
//               include: [{
//                 model: CardAttackCost,
//                 as: "costs",
//               }],
//             },
//             {
//               model: CardAbility,
//               as: "abilities",
//             },
//             {
//               model: CardDamageModification,
//               as: "damageModifications",
//             },
//             {
//               model: CardAttribute,
//               as: "attributes",
//             },
//             {
//               model: CardDexId,
//               as: "dexIds",
//             },
//           ],
//         });
//         await currentCard.$set("cardSet", currentCardSet);
//       }));
//     }));
//   }),
// );

export const fullSetList = {
  AOR: "AOR",
  ASR: "ASR",
  BST: "SWSH5",
  BLW: "BLW",
  BWP: "PRBW",
  BCR: "BCR",
  BKP: "BKP",
  BKT: "BKT",
  BRS: "BRS",
  BUS: "SM03",
  CL: "CL",
  CEL: "CEL",
  CES: "SM07",
  CPA: "SWSH35",
  CRE: "CRE",
  CEC: "SM12",
  CIN: "SM04",
  DEX: "DEX",
  DAA: "SWSH3",
  DET: "DPK",
  DCR: "DCR",
  DRM: "SM75",
  DRV: "DRV",
  DRX: "DRX",
  EPO: "EPO",
  EVO: "EVO",
  EVS: "EVS",
  FCO: "FAC",
  FLF: "FLF",
  FLI: "SM06",
  FFI: "FFI",
  FST: "FST",
  GEN: "GNR",
  GRI: "SM02",
  HS: "HGSS",
  HSP: "PRHS",
  HIF: "SM115",
  KSS: "KSS",
  LTR: "LTR",
  LOT: "SM08",
  NXD: "NXD",
  NVI: "NVI",
  PHF: "PHF",
  PLB: "PLB",
  PLF: "PLF",
  PLS: "PLS",
  PGO: "PGO",
  PRC: "PRC",
  RCL: "SWSH2",
  ROS: "ROS",
  SHF: "SWSH45",
  SLG: "SLE",
  STS: "STS",
  SUM: "SM01",
  SMP: "PRSM",
  SSH: "SWSH1",
  SSP: "PRSWSH",
  TEU: "SM09",
  TM: "TM",
  UPR: "SM05",
  UNB: "SM10",
  UD: "UD",
  UNM: "SM11",
  UL: "UL",
  VIV: "SWSH4",
  XY: "XY",
  XYP: "PRXY",
};

const aze = ["LOR",
  "PGO",
  "ASR",
  "BRS",
  "FST",
  "CEL",
  "EVS",
  "CRE",
  "SWSH5",
  "SWSH45",
  "SWSH4",
  "SWSH35",
  "SWSH3",
  "SWSH2",
  "SWSH1",
  "SM12",
  "SM115",
  "SM11",
  "SM10",
  "SM09",
  "SM08",
  "SM75",
  "SM07",
  "SM06",
  "SM05",
  "SM04",
  "SLE",
  "SM03",
  "SM02",
  "SM01",
  "EVO",
  "STS",
  "FAC",
  "GNR",
  "BKP",
  "BKT",
  "AOR",
  "ROS",
  "DCR",
  "PRC",
  "PHF",
  "FFI",
  "FLF",
  "XY",
  "KSS",
  "LTR",
  "PLB",
  "PLF",
  "PLS",
  "BCR",
  "DRV",
  "DRX",
  "DEX",
  "NXD",
  "NVI",
  "EPO",
  "BLW",
  "CL",
  "TM",
  "UD",
  "UL",
  "HGSS",
  "AR",
  "SV",
  "RR",
  "PT",
  "SF",
  "LA",
  "MD",
  "GE",
  "SW",
  "MT",
  "DP",
  "PK",
  "DF",
  "CG",
  "HP",
  "LM",
  "DS",
  "UF",
  "EM",
  "TMTA",
  "DX",
  "TRR",
  "RFVF",
  "HL",
  "DR",
  "SS",
  "RS",
  "SK",
  "AQ",
  "EX",
  "LC",
  "N4",
  "NR",
  "ND",
  "NG",
  "GC",
  "GH",
  "TR",
  "BS2",
  "FO",
  "JU",
  "BS",
  "TOT22",
  "FUTSAL",
  "DPK",
  "PRAL",
  "PRXY",
  "RUM",
  "POP9",
  "POP8",
  "POP7",
  "POP6",
  "POP5",
  "POP4",
  "POP3",
  "POP2",
  "POP1",
  "PCP",
  "SI",
  "WBP",
  "BXT",
  "ADC2-E",
  "ADC2-P",
  "ADC2-C",
  "ADC-M",
  "ADC-P",
  "ADC-D",
  "TK11-S",
  "TK11-F",
  "TK10-R",
  "TK10-L",
  "TK9-S",
  "TK9-P",
  "TK8-LO",
  "TK8-LA",
  "TK7-G",
  "TK7-S",
  "TK6-B",
  "TK6-N",
  "TK5-M",
  "TK5-Z",
  "TK4-R",
  "TK4-L",
  "TK3-M",
  "TK3-L",
  "TK1-LO",
  "TK1-LA",
  "TK2-P",
  "TK2-N",
  "WC19",
  "WC18",
  "WC17",
  "WC16",
  "WC15",
  "WC14",
  "WC13",
  "WC12",
  "WC11",
  "WC10",
  "WC09",
  "WC08",
  "WC07",
  "WC06",
  "WC05",
  "WC04",
  "MC11US",
  "MC10US",
  "MC9",
  "MC9US",
  "MC8US",
  "MC8",
  "MC7",
  "MC6",
  "MC5",
  "MC4",
  "MC3",
  "MC2",
  "MC1",
  "NRGY",
  "ARTAC",
  "JFC",
  "TOPPS",
  "JUMBO",
  "PWC10",
  "PWC98",
  "PRWC",
  "PRDP",
  "PRNI",
  "HGSSS",
  "FAC",
  "GNR",
  "XYA",
  "PRXY",
  "TK1-L0",
  "PRHS",
  "PRXY",
  "PRBW",
  "PRSM",
  "PRSWSH"
]