import { ICardAdditionalPrinting } from "./card-additional-printing.model";
import {
  CardPossessionDeletionTypeEnum,
  CardVariationConditionEnum,
  CardVariationGradeCompanyEnum,
} from "../../src/enums/card-variation.enum";
import { ICard } from "./card.model";
import { ITag } from "./tag.model";
import { IUser } from "./user.model";

export type IUserCardPossession = {
  id: string;
  userId: string;
  user: IUser;
  cardId: string;
  card: ICard;
  condition?: CardVariationConditionEnum | null;
  grade?: CardVariationGradeCompanyEnum | null;
  printingId: string | null;
  printing: ICardAdditionalPrinting | null;
  tags?: ITag[];
  note: string | null;
  boosterId: string | null;
  deletionType: CardPossessionDeletionTypeEnum | null;
  createdAt?: Date;
};
