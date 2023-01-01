import { CardAttack } from './card-attack';
import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { Overwrite } from 'abyss_core';
import { CardTypeEnum, ICardAttackCost } from 'vokit_core';

export type ModelCardAttackCost = Overwrite<
  ICardAttackCost,
  {
    cardAttack: CardAttack;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardAttackCost', paranoid: false, timestamps: false })
export class CardAttackCost
  extends CustomModel<ModelCardAttackCost>
  implements ModelCardAttackCost
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => CardAttack)
  @Column({
    type: DataType.STRING,
  })
  cardAttackId: string;

  @BelongsTo(() => CardAttack)
  cardAttack: CardAttack;

  @Column({
    type: DataType.INTEGER,
  })
  cost: number;

  @Column({
    type: DataType.INTEGER,
  })
  type: CardTypeEnum;
}
