import { CardTypeEnum } from './../../enums/card-type.enum';
import { ICard } from './card.dto';

export type ICardType = {
  id: string,
  cardId: string,
  card: ICard,
  type: CardTypeEnum
}