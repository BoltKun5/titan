import { IUserCardPossession } from "./user-card-possession.dto";
import { IUser } from "./user.dto";
import { TagTypeEnum } from "../../enums/tag-type.enum";

export type ITag = {
  id: string;
  type: TagTypeEnum;
  name: string;
  userId: string;
  // association
  user?: IUser;
  cardPossession?: IUserCardPossession[];
};
