import {Card} from "../../../../api/src/database";

export const initialRarityFilter = [
  {
    rarity: "Common",
    value: false,
  },
  {
    rarity: "Uncommon",
    value: false,
  },
  {
    rarity: "Rare",
    value: false,
  },
  {
    rarity: "Holo",
    value: false,
  },
  {
    rarity: "Ultra Rare",
    value: false,
  },
  {
    rarity: "Secret Rare",
    value: false,
  },
  {
    rarity: "None",
    value: false,
  },
  {
    rarity: "Amazing",
    value: false
  }
]

export const frontRarity: frontRarityType = {
  "Common": "Commune",
  "Uncommon": "Peu commune",
  "Rare": "Rare",
  "Holo": "Holographique",
  "Secret Rare": "Secrète",
  "Ultra Rare": "Ultra Rare",
  "None": "Promotionnelle",
  "Amazing": "Incroyable"
}

type frontRarityType = {
  Common: string,
  Uncommon: string,
  Rare: string,
  Holo: string,
  "Secret Rare": string,
  "Ultra Rare": string,
  None: string,
  Amazing: string
}
