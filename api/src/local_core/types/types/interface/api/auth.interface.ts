import { CardSet, User } from "../../../../../database";

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
  user: {
    shownName: string,
    id: string
  },
  token: string
}

export interface IUpdateUserCardsBody {
  token: string,
  cardId: string,
  classicQuantity: string,
  reverseQuantity: string,
}

export interface IIncrementUserCardsBody {
  token: string,
  cardId: string,
  type: "normal" | "reverse"
}

export interface IIncrementManyUserCardsBody {
  token: string,
  cards: [{
    cardId: string,
    type: "normal" | "reverse"
  }]
}

export interface IHistoricQuery {
  token: string,
  userId: string
}

export interface IUpdateUserCardsResponse {
  code: string,
  result: any
}

export interface ICardListResponse {
  set: CardSet
}

export interface IHistoricResponse {
  result: any
}