import { ICard } from './card.dto';
import { IUser } from './user.dto';

export type IUserCardPossession = {
  id: string,
  userId: string,
  user: IUser,
  cardId: string,
  card: ICard,
  classicQuantity: number,
  reverseQuantity: number,
}