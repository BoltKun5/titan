import { ITag } from './tag.model';
import { IUserCardPossession } from './user-card-possession.model';

export type IUser = {
  id: string;
  role: number;
  shownName: string;
  mail: string;
  options: Record<string, string> | null;
  password: string;
  cards: IUserCardPossession[];
  tags: ITag[];
  isActive: boolean;
};
