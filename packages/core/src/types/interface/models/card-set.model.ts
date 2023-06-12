import { CardCountType, ICard, ICardSerie } from '..';

export type ICardSet = {
  id: string;
  name: string;
  cardCount: CardCountType;
  cards: ICard[];
  releaseDate: Date;
  code: string;
  cardSerieId: string;
  cardSerie: ICardSerie;
  imageId: string;
  logoId: string;
};
