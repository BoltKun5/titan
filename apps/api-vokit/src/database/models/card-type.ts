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
import { CardTypeEnum, ICardType } from '../../../../local-core';
import { Overwrite } from 'abyss_core';

export type ModelCardType = Overwrite<
  ICardType,
  {
    card: Card;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardType', paranoid: false, timestamps: false })
export class CardType extends CustomModel<ModelCardType> implements ModelCardType {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.STRING,
  })
  cardId: string;

  @BelongsTo(() => Card)
  card: Card;

  @Column({
    type: DataType.INTEGER,
  })
  type: CardTypeEnum;
}
