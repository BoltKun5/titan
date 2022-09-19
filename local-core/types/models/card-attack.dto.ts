import { ICardAttackCost } from "./card-attack-cost.dto"
import { ICard } from "./card.dto"

export type ICardAttack = {
  id: string,
  cardEntityId: string,
  cardEntity: ICard,
  costs: ICardAttackCost[],
  name: string,
  effect: string,
  damage: string
}