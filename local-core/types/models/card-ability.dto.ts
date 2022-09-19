import { CardAbilityTypeEnum } from "../../enums"
import { ICard } from "../models/card.dto"

export type ICardAbility = {
  id: string,
  cardEntityId: string,
  cardEntity: ICard,
  name: string,
  effect: string,
  type: CardAbilityTypeEnum
}