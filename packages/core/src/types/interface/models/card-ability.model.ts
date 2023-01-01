import { CardAbilityTypeEnum } from "../../src/enums";
import { ICard } from "./card.model";

export type ICardAbility = {
  id: string;
  cardEntityId: string;
  cardEntity: ICard;
  name: string;
  effect: string;
  type: CardAbilityTypeEnum;
};
