import { IUserCardPossession } from '../../models';

export interface ICreatePossessionBody {
  cardId: string;
  cardPrintingId?: string;
}

export interface ISimpleDeletePossessionBody {
  cardId: string;
  cardPrintingId?: string;
}

export interface IDeletePossessionBody {
  possessionId: string;
}

export interface IUpdatePossessionBody {
  cardId: string;
  possessions: IUserCardPossession[];
  createdTags?: { cardPossessionId: string; tagId: string }[];
  deletedTags?: { cardPossessionId: string; tagId: string }[];
}

export interface ICreateMultiplePossessionBody {
  cards: {
    cardId: string;
    printingId: string;
  }[];
}

export interface ISetQuantityBody {
  cardId: string;
  cardPrintingId: string;
  quantity: number;
}

export interface IHistoricQuery {
  userId: string;
}
