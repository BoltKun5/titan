import { IUserCardPossession } from '../../models';

export interface ICreatePossessionResponse {
  possession: IUserCardPossession;
}

export interface ISimpleDeletePossessionResponse {
  deletedId?: string;
}

export interface IDeletePossessionResponse {
  deletedId: string;
}

export interface IUpdatePossessionResponse {
  possessions: IUserCardPossession[];
}

export interface ICreateMultiplePossessionResponse {
  result: IUserCardPossession[];
}

export interface ISetQuantityResponse {
  code: string;
  result?: IUserCardPossession[] | string[];
}

export interface IHistoricResponse {
  result: any;
}
