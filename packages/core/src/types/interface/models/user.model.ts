import { ITag } from "./tag.model";
import { IUserCardPossession } from "./user-card-possession.model";

export type IUser = {
  id: string;
  role: number;
  shownName: string;
  username: string;
  password: string;
  cards: IUserCardPossession[];
  tags: ITag[];
};
