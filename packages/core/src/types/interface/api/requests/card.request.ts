import { CardRarityEnum } from '../../../../enums';

export interface ICardQuery {
  order?: 'default' | 'name' | 'type';
  namefilter?: string;
  rarity?: CardRarityEnum;
  page?: number;
  stats?: string;
  unowned?: 'show' | 'hide';
  setFilter?: string;
}
