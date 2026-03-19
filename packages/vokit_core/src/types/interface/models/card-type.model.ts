import { CardTypeEnum } from '../../../enums';
import { ICard } from './card.model';

export type ICardType = {
  id: string;
  cardId: string;
  card: ICard;
  type: CardTypeEnum;
};
