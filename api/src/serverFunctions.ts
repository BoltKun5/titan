import axios from "axios";
import * as fs from "fs";
import api from "./config/api";
import {response} from "express";
import {replace, split} from "lodash";
import {
  CardAbilityTypeEnum,
  CardCategoryEnum, CardDamageModificationType, CardEnergyTypeEnum,
  CardEvolutionStageEnum,
  CardRarityEnum,
  CardTrainerTypeEnum, CardTypeEnum,
} from "./local_core";
import {Card, CardAttack, CardAttribute, CardSet} from "./database";
import {CardType} from "./database/models/CardType";
import {CardAttackCost} from "./database/models/CardAttackCost";
import {CardAbility} from "./database/models/CardAbility";
import {CardDamageModification} from "./database/models/CardDamageModification";
import {CardDexId} from "./database/models/CardDexId";

export const getSetIcons = async () => {
  for (const name of ["a"]) {
    const URL = `https://www.pokecardex.com/assets/images/symboles/${name}.png`;
    try {
      const res = await axios.get(URL, {
        responseType: 'arraybuffer',
      });
      if (!fs.existsSync(`./img`))
        fs.mkdirSync(`./img`)
      fs.writeFileSync(`./img/${name}.png`, Buffer.from(res.data as any));
    } catch (e) {
      break;
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

export const getDataFromLimitless = async () => {
  const jsdom = require("jsdom");
  const {JSDOM} = jsdom;
  const response = await axios.get("https://limitlesstcg.com/cards/fr?q=%21set%3ASMP&show=100&page=3", {
    headers: {
      Cookie: "cards_display=full",
    },
  });
  const dom = new JSDOM(response.data);
  const cardSet = await CardSet.findOne({
    where: {
      code: 'SMP',
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
  const myArray = {
    // AOR: "AOR",
    // ASR: "ASR",
    // BST: "SWSH5",
    // BLW: "BLW",
    // BWP: "PRBW",
    // BCR: "BCR",
    // BKP: "BKP",
    // BKT: "BKT",
    // BRS: "BRS",
    // BUS: "SM03",
    // CL: "CL",
    // CEL: "CEL",
    // CES: "SM07",
    // CPA: "SWSH35",
    // CRE: "CRE",
    // CEC: "SM12",
    // CIN: "SM04",
    // DEX: "DEX",
    // DAA: "SWSH3",
    // DET: "DPK",
    // DCR: "DCR",
    // DRM: "SM75",
    // DRV: "DRV",
    // DRX: "DRX",
    // EPO: "EPO",
    // EVO: "EVO",
    // EVS: "EVS",
    // FCO: "FAC",
    // FLF: "FLF",
    // FLI: "SM06",
    // FFI: "FFI",
    // FST: "FST",
    // GEN: "GNR",
    // GRI: "SM02",
    // HS: "HGSS",
    // HSP: "PRHS",
    // HIF: "SM115",
    // KSS: "KSS",
    // LTR: "LTR",
    // LOT: "SM08",
    // NXD: "NXD",
    // NVI: "NVI",
    // PHF: "PHF",
    // PLB: "PLB",
    // PLF: "PLF",
    // PLS: "PLS",
    // PGO: "PGO",
    // PRC: "PRC",
    // RCL: "SWSH2",
    // ROS: "ROS",
    // SHF: "SWSH45",
    // SLG: "SLE",
    // STS: "STS",
    // SUM: "SM01",
    SMP: "PRSM",
    // SSH: "SWSH1",
    // SSP: "PRSWSH",
    // TEU: "SM09",
    // TM: "TM",
    // UPR: "SM05",
    // UNB: "SM10",
    // UD: "UD",
    // UNM: "SM11",
    // UL: "UL",
    // VIV: "SWSH4",
    // XY: "XY",
    // XYP: "PRXY",
  };
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
