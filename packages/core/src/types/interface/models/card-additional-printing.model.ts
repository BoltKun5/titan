import { CardAdditionalPrintingTypeEnum, CardAdditionalPrintingCreatorEnum } from '../../../enums';
import { ICard } from './card.model';

export type ICardAdditionalPrinting = {
  id: string;
  type: CardAdditionalPrintingTypeEnum;
  cardId: string;
  card: ICard;
  name: string;
  creator: CardAdditionalPrintingCreatorEnum;
};
