import { ICardAdditionalPrinting } from "./card-additional-printing.dto";
import {
  CardPossessionDeletionTypeEnum,
  CardVariationConditionEnum,
  CardVariationGradeCompanyEnum,
} from "./../../enums/card-variation.enum";
import { ICard } from "./card.dto";
import { ITag } from "./tag.dto";
import { IUser } from "./user.dto";

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
