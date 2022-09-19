import { ICardSerie } from './card-serie.dto';
import { CardCountType } from './../card-count.type';
import { ICard } from './card.dto';

export type ICardSet = {
  id: string,
  name: string,
  cardCount: CardCountType,
  tcgOnline: string,
  isPlayableInStandard: boolean,
  isPlayableInExpanded: boolean,
  cards: ICard[],
  releaseDate: Date,
  code: string,
  cardSerieId: string,
  cardSerie: ICardSerie
}