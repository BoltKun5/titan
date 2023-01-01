import { ICard } from "./card.dto";
import { ITag } from "./tag.dto";

export type ICardTag = {
  id: string;
  tagId: string;
  cardPossessionId: string;
};
