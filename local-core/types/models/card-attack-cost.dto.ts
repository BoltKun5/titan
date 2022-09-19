import { CardTypeEnum } from './../../enums/card-type.enum';
import { ICardAttack } from './card-attack.dto';

export type ICardAttackCost = {
  id: string,
  cardAttackId: string,
  cardAttack: ICardAttack,
  cost: number,
  type: CardTypeEnum
}