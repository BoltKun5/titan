import { IUserCardPossession } from "./user-card-possession.dto";

export type ICardPossessionHistoric = {
  id: string,
  cardPossessionId: string,
  cardPossession: IUserCardPossession,
  boosterId: string, 
  oldClassicQuantity: number,
  newClassicQuantity: number,
  oldReverseQuantity: number,
  newReverseQuantity: number,
}