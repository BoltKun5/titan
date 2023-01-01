import { CardTypeEnum } from "../../src/enums/card-type.enum";
import { ICardAttack } from "./card-attack.model";

export type ICardAttackCost = {
  id: string;
  cardAttackId: string;
  cardAttack: ICardAttack;
  cost: number;
  type: CardTypeEnum;
};
