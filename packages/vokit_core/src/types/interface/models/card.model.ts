import { CardRarityEnum, CardRarityEnumFrench, CardCategoryEnum } from '../../../enums';
import { ICardAdditionalPrinting } from './card-additional-printing.model';
import { ICardSet } from './card-set.model';
import { ICardType } from './card-type.model';
import { IUserCardPossession } from './user-card-possession.model';

export type ICard = {
  id: string;
  name: string;
  rarity: CardRarityEnum | CardRarityEnumFrench;
  category: CardCategoryEnum;
  setId: string;
  cardSet: ICardSet;
  types: ICardType[];
  canBeReverse: boolean;
  localId: string;
  userCardPossessions: IUserCardPossession[];
  cardAdditionalPrinting: ICardAdditionalPrinting[];
  imageId: string;
  thumbnailId: string;
};
