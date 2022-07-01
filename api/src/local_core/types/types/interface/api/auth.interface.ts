import { ErrorType } from "abyss_core";
import { Card, User } from "../../../../../database";
import { UserCardPossession } from "../../../../../database/models/UserCardPossession";

// TODO: trier les interface en dossiers

export interface ISigninAuthBody {
  password: string,
  username: string
}

export interface ISignupAuthBody {
  password: string,
  username: string,
  shownName: string,
}

export interface ISignupAuthResponse {
  user: User,
  token: string
}

export interface ISigninAuthResponse {
  user: User,
  token: string
}

export interface IResponse<T> {
  data: T;
  error?: IApiError | Error;
}

export interface IApiError {
  type: ErrorType;
  code: string;
  message: string;
  params?: string;
  field?: string;
}

export interface IUpdateUserCardsBody {
  token: string,
  cards: [
    {
      cardId: string,
      classicQuantity: string,
      reverseQuantity: string
    }
  ]
}

export interface IUpdateUserCardsResponse {
  code: string;
}

export interface IGetAllUserCardsBody {
  pagination: IPagination;
}

export interface IGetUserCardsResponse {
  totalCards: number,
  paginationOptions: IPagination,
  cardsList: [
    card: {
      UserCardPossession,
      classicQuantity: string,
      reverseQuantity: string
    },
  ]
}

export interface IPagination {
  page: number,
  itemPerPage: number
}
