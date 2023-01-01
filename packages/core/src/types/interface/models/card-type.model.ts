import { CardTypeEnum } from "../../src/enums/card-type.enum";
import { ICard } from "./card.model";

export type ICardType = {
  id: string;
  cardId: string;
  card: ICard;
  type: CardTypeEnum;
};
