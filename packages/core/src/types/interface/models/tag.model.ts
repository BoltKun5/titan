import { IUserCardPossession } from "./user-card-possession.model";
import { IUser } from "./user.model";
import { TagTypeEnum } from "../../src/enums/tag-type.enum";

export type ITag = {
  id: string;
  type: TagTypeEnum;
  name: string;
  userId: string;
  // association
  user?: IUser;
  cardPossession?: IUserCardPossession[];
};
