import { ITag } from "./tag.dto";
import { IUserCardPossession } from "./user-card-possession.dto";

export type IUser = {
  id: string;
  role: number;
  shownName: string;
  username: string;
  password: string;
  cards: IUserCardPossession[];
  tags: ITag[];
};
