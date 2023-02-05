import { IPagination } from './../../global/pagination';
import { ICard } from '../../models';
import { StatisticsDataType } from '../../../dto';

export interface ICardListResponse {
  cards: ICard[];
  pagination: IPagination;
}

export interface IStatsResponse {
  stats: StatisticsDataType;
}

export interface ICardUpdateResponse {
  card: ICard;
}
