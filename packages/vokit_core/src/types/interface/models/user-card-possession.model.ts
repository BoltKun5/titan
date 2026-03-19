import { CardPossessionLanguageEnum } from './../../../enums/card-variation.enum';
import {
  CardPossessionConditionEnum,
  CardPossessionGradeCompanyEnum,
  CardPossessionDeletionTypeEnum,
} from '../../../enums';
import { ICardAdditionalPrinting } from './card-additional-printing.model';
import { ICard } from './card.model';
import { ITag } from './tag.model';
import { IUser } from './user.model';

export type IUserCardPossession = {
  id: string;
  userId: string;
  user: IUser;
  cardId: string;
  card: ICard;
  condition?: CardPossessionConditionEnum | null;
  grade?: CardPossessionGradeCompanyEnum | null;
  printingId: string | null;
  printing: ICardAdditionalPrinting | null;
  tags?: ITag[];
  language: CardPossessionLanguageEnum | null;
  note: string | null;
  boosterId: string | null;
  deletionType: CardPossessionDeletionTypeEnum | null;
  createdAt?: Date;
};
