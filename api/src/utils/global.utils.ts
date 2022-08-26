import {Card} from "../database";

export const notReverseRarities = [1, 3, 5, 6]

export const canBeReverse = (card: Card) => {
  if (card.cardSet.code === 'CEL') return card.canBeReverse
  return !notReverseRarities.includes(card.rarity)
}
