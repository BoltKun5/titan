import { CardRarityEnum } from '../../../../enums';

export interface ICardQuery {
  order?: 'default' | 'name' | 'type';
  namefilter?: string;
  rarity?: CardRarityEnum;
  page?: number;
  stats?: boolean;
  possession?: 'partial_owned' | 'partial_unowned' | 'multiple_owned' | 'unowned' | 'fully_owned';
  setFilter?: string[];
}
