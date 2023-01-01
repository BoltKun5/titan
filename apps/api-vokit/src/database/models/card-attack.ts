import { CardAttackCost } from './card-attack-cost';
import { Card } from './card';
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
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { ICardAttack, Overwrite } from 'vokit_core';

export type ModelCardAttack = Overwrite<
  ICardAttack,
  {
    cardEntity: Card;
    costs: CardAttackCost[];
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardAttack', paranoid: false, timestamps: false })
export class CardAttack extends CustomModel<ModelCardAttack> implements ModelCardAttack {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.STRING,
  })
  cardEntityId: string;

  @BelongsTo(() => Card)
  cardEntity: Card;

  @HasMany(() => CardAttackCost)
  costs: CardAttackCost[];

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING(1047),
  })
  effect: string;

  @Column({
    type: DataType.STRING,
  })
  damage: string;
}
