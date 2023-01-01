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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { Overwrite } from 'abyss_core';
import { ICardAttribute } from '../../../../local-core';

export type ModelCardAttribute = Overwrite<
  ICardAttribute,
  {
    cardEntity: Card;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardAttribute', paranoid: false, timestamps: false })
export class CardAttribute extends CustomModel<ModelCardAttribute> implements ModelCardAttribute {
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
  attribute: string;
}
