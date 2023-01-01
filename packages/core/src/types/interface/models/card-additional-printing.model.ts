import {
  CardAdditionalPrintingCreatorEnum,
  CardAdditionalPrintingTypeEnum,
} from "../../src/enums/card-additional-printing.enum";
import { ICard } from "./card.model";

export type ICardAdditionalPrinting = {
  id: string;
  type: CardAdditionalPrintingTypeEnum;
  cardId: string;
  card: ICard;
  name: string;
  creator: CardAdditionalPrintingCreatorEnum;
};
