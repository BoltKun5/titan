import { CardDamageModificationType } from "../../src/enums/card-damage-modification-type.enum";
import { ICard } from "./card.model";
import { CardTypeEnum } from "../../src/enums/card-type.enum";

export type ICardDamageModification = {
  id: string;
  cardEntityId: string;
  cardEntity: ICard;
  modificationType: CardDamageModificationType;
  type: CardTypeEnum;
  value: string;
};
