import { IUserCardPossession, ICardSet } from '../../../models';
import { ITag } from '../../../models/tag.model';

export interface ISignupAuthResponse {
  user: {
    shownName: string;
    id: string;
    role: number;
  };
  token: string;
}

export interface ISigninAuthResponse {
  user: {
    shownName: string;
    id: string;
    role: number;
  };
  token: string;
}

export interface ICreatePossessionResponse {
  code: string;
  possession?: IUserCardPossession;
}

export interface ISimpleDeletePossessionResponse {
  code: string;
  deletedId?: string;
}

export interface IDeletePossessionResponse {
  code: string;
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

export interface ICardListResponse {
  set: ICardSet;
}

export interface IHistoricResponse {
  result: any;
}

export interface IUserTagsResponse {
  tags: ITag[];
}

export interface ICreateTagResponse {
  tags: ITag[];
}
