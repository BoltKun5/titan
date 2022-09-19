import { ICard } from './card.dto';

export type ICardDexId = {
  id: string,
  cardId: string,
  cardEntity: ICard,
  dexId: string,
}