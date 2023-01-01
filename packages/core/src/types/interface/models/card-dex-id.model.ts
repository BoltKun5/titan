import { ICard } from "./card.model";

export type ICardDexId = {
  id: string;
  cardId: string;
  cardEntity: ICard;
  dexId: string;
};
