import {
  CardVariationConditionEnum,
  CardVariationGradeCompanyEnum,
} from "../../enums";
import { ICardSet, IUserCardPossession } from "../../types";
import { ITag } from "../../types/models/tag.dto";

export interface ISigninAuthBody {
  password: string;
  username: string;
}

export interface ISignupAuthBody {
  password: string;
  username: string;
  shownName: string;
}

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

export interface ICreatePossessionBody {
  token: string;
  cardId: string;
  cardPrintingId?: string;
  possessionId?: string;
}

export interface ICreatePossessionResponse {
  code: string;
  possession?: IUserCardPossession;
}

export interface ISimpleDeletePossessionBody {
  token: string;
  cardId: string;
  cardPrintingId?: string;
  possessionId?: string;
}

export interface ISimpleDeletePossessionResponse {
  code: string;
  deletedId?: string;
}

export interface IDeletePossessionBody {
  token: string;
  possessionId: string;
}

export interface IDeletePossessionResponse {
  code: string;
}

export interface IUpdatePossessionBody {
  token: string;
  cardId: string;
  possessions: IUserCardPossession[];
  createdTags?: { cardPossessionId: string; tagId: string }[];
  deletedTags?: { cardPossessionId: string; tagId: string }[];
}

export interface IUpdatePossessionResponse {
  possessions: IUserCardPossession[];
}

export interface ICreateMultiplePossessionBody {
  token: string;
  cards: {
    cardId: string;
    cardPrintingId: string;
  }[];
}

export interface ICreateMultiplePossessionResponse {
  code: string;
  result: IUserCardPossession[];
}

export interface ISetQuantityBody {
  token: string;
  cardId: string;
  cardPrintingId: string;
  quantity: number;
}

export interface ISetQuantityResponse {
  code: string;
  result?: IUserCardPossession[] | string[];
}

export interface IIncrementManyUserCardsBody {
  token: string;
  cards: [
    {
      cardId: string;
      type: "normal" | "reverse";
    }
  ];
}

export interface IHistoricQuery {
  token: string;
  userId: string;
}

export interface ICardListResponse {
  set: ICardSet;
}

export interface IHistoricResponse {
  result: any;
}

export interface IUserTagsBody {
  token: string;
}

export interface IUserTagsResponse {
  tags: ITag[];
}

export interface ICreateTagBody {
  token: string;
  name: string;
}

export interface ICreateTagResponse {
  tags: ITag[];
}
