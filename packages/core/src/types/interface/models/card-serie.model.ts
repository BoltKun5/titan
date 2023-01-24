import { ICardSet } from './card-set.model';

export type ICardSerie = {
  id: string;
  name: string;
  code: string;
  cardSets?: ICardSet[];
};
