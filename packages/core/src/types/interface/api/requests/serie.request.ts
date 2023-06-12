// import { CardCountType } from '../../global';

export interface ISetUpdateBody {
  id: string;
  name: string;
  cardSerieId: string;
  // cardCount: CardCountType;
  releaseDate: Date;
  code: string;
}

export interface ISerieUpdateBody {
  id: string;
  name: string;
  code: string;
}

export interface ICreateSetBody {
  cardSerieId: string;
}

export interface IImportDataBody {
  data: any[];
  id: string;
}
