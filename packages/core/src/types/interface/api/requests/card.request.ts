import { CardRarityEnum, CardTypeEnum } from '../../../../enums';

export interface ICardQuery {
  order?: 'default' | 'name' | 'type';
  namefilter?: string;
  rarity?: CardRarityEnum;
  page?: number;
  stats?: boolean;
  possession?: 'partial_owned' | 'partial_unowned' | 'multiple_owned' | 'unowned' | 'fully_owned';
  setFilter?: string[];
  userId?: string;
}

export interface IUpsertCardBody {
  id: string;
  canBeReverse: boolean;
  cardAdditionalPrinting: { id?: string; type: number; name: string; creator: number }[];
  localId: string;
  name: string;
  rarity: number;
  setId: string;
  types: CardTypeEnum[];
}
