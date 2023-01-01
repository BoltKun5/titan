import { ICardSerie } from "./card-serie.model";
import { CardCountType } from "../dto/card-count.type";
import { ICard } from "./card.model";

export type ICardSet = {
  id: string;
  name: string;
  cardCount: null;
  tcgOnline: string;
  isPlayableInStandard: boolean;
  isPlayableInExpanded: boolean;
  cards: ICard[];
  releaseDate: Date;
  code: string;
  cardSerieId: string;
  cardSerie: ICardSerie;
};
