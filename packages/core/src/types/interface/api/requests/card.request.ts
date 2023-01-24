import { CardRarityEnum } from '../../../../enums';

export interface ICardQuery {
  order?: 'default' | 'name' | 'type';
  namefilter?: string;
  rarity?: CardRarityEnum;
  page?: number;
  stats?: boolean;
  possession?: 'owned' | 'unowned';
  setFilter?: string[];
}
