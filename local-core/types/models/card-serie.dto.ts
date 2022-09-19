import { ICardSet } from "./card-set.dto"

export type ICardSerie = {
  id: string,
  name: string,
  code: string,
  cardSets: ICardSet[]
}