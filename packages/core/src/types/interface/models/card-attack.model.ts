import { ICardAttackCost } from "./card-attack-cost.model";
import { ICard } from "./card.model";

export type ICardAttack = {
  id: string;
  cardEntityId: string;
  cardEntity: ICard;
  costs: ICardAttackCost[];
  name: string;
  effect: string;
  damage: string;
};
