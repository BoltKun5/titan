// import { CardCountType } from '../../global';

export interface ISetUpdateBody {
  id: string;
  name: string;
  cardSerieId: string;
  // cardCount: CardCountType;
  releaseDate: Date;
  code: string;
  logoId: string;
  imageId: string;
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
