import { CustomModel } from './../custom/custom-model';
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
import { Overwrite } from 'abyss_core';
import { CardAbilityTypeEnum, ICardAbility } from '../../../../local-core';
import { Card } from './card';

export type ModelCardAbility = Overwrite<
  ICardAbility,
  {
    cardEntity: Card;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardAbility', paranoid: false, timestamps: false })
export class CardAbility extends CustomModel<ModelCardAbility> implements ModelCardAbility {
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

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING(1047),
  })
  effect: string;

  @Column({
    type: DataType.INTEGER,
  })
  type: CardAbilityTypeEnum;
}
