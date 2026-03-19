import { ICardSet } from '../../models';
import { ICardSerie } from './../../models/card-serie.model';

export interface IGetAllSeriesResponse {
  data: ICardSerie[];
}

export interface ISetUpdateResponse {
  cardSet: ICardSet;
}

export interface ISerieUpdateResponse {
  cardSerie: ICardSerie;
}
