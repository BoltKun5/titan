import { ICard } from "./card.model";

export type ICardAttribute = {
  id: string;
  cardEntityId: string;
  cardEntity: ICard;
  attribute: string;
};
