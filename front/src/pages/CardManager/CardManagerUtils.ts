import { CardRarityEnum } from './../../../../local-core/enums/card-rarity.enum';
import { ICard } from "../../../../local-core/types/models/card.dto"

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
    value: false,
  },
]

export const frontRarity: frontRarityType = {
  "Common": "Commune",
  "Uncommon": "Peu commune",
  "Rare": "Rare",
  "Holo": "Holographique",
  "Secret Rare": "Secrète",
  "Ultra Rare": "Ultra Rare",
  "None": "Promotionnelle",
  "Amazing": "Magnifique",
}

type frontRarityType = {
  [index: string]: string,
}

export const initialCardList = [
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
]

export type CardListElement = {
  card: ICard | null,
  type?: "normal" | "reverse",
  error?: string
}

export const getImageSource = (card: ICard): string => {
  const isValid = !isNaN(Number(card.localId));
  if (isValid) return "src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"
  return "src/assets/cards/" + card.cardSet.code + "/" + card.localId + ".jpg"
}
