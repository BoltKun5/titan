import { IUserCardPossession } from '../../..';

export interface ISigninAuthBody {
  password: string;
  username: string;
}

export interface ISignupAuthBody {
  password: string;
  username: string;
  shownName: string;
}

export interface ICreatePossessionBody {
  token: string;
  cardId: string;
  cardPrintingId?: string;
  possessionId?: string;
}

export interface ISimpleDeletePossessionBody {
  token: string;
  cardId: string;
  cardPrintingId?: string;
  possessionId?: string;
}

export interface IDeletePossessionBody {
  token: string;
  possessionId: string;
}

export interface IUpdatePossessionBody {
  token: string;
  cardId: string;
  possessions: IUserCardPossession[];
  createdTags?: { cardPossessionId: string; tagId: string }[];
  deletedTags?: { cardPossessionId: string; tagId: string }[];
}

export interface ICreateMultiplePossessionBody {
  token: string;
  cards: {
    cardId: string;
    printingId: string;
    userId: string;
    boosterId?: string;
  }[];
}

export interface ISetQuantityBody {
  token: string;
  cardId: string;
  cardPrintingId: string;
  quantity: number;
}

export interface IIncrementManyUserCardsBody {
  token: string;
  cards: [
    {
      cardId: string;
      type: 'normal' | 'reverse';
    },
  ];
}

export interface IHistoricQuery {
  token: string;
  userId: string;
}

export interface IUserTagsBody {
  token: string;
}

export interface ICreateTagBody {
  token: string;
  name: string;
}
