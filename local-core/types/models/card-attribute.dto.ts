import { ICard } from './card.dto';

export type ICardAttribute = {
  id: string,
  cardEntityId: string,
  cardEntity: ICard,
  attribute: string
}