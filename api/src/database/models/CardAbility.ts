import { Card } from "./Card";
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
  BelongsTo
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { CustomModel } from "../custom/CustomModel";
import { Overwrite } from 'abyss_core';
import { CardAbilityTypeEnum, ICardAbility } from "../../../../local-core";

export type ModelCardAbility = Overwrite<ICardAbility,
  {
    cardEntity: Card;
  }
>;


@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: "CardAbility", paranoid: false, timestamps: false })
export class CardAbility extends CustomModel implements ModelCardAbility {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.STRING
  })
  cardEntityId: string;

  @BelongsTo(() => Card)
  cardEntity: Card;

  @Column({
    type: DataType.STRING
  })
  name: string;

  @Column({
    type: DataType.STRING(1047)
  })
  effect: string;

  @Column({
    type: DataType.INTEGER
  })
  type: CardAbilityTypeEnum;
}
