import {
  CardAdditionalPrintingCreatorEnum,
  CardAdditionalPrintingTypeEnum,
} from "./../../enums/card-additional-printing.enum";
import { ICard } from "./card.dto";

export type ICardAdditionalPrinting = {
  id: string;
  type: CardAdditionalPrintingTypeEnum;
  cardId: string;
  card: ICard;
  name: string;
  creator: CardAdditionalPrintingCreatorEnum;
};
