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
import { CustomModel } from '../custom/custom-model';
import { ICardDexId } from '../../../../local-core/types';
import { Overwrite } from 'abyss_core';

export type ModelCardDexId = Overwrite<
  ICardDexId,
  {
    cardEntity: Card;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardDexId', paranoid: false, timestamps: false })
export class CardDexId extends CustomModel<ModelCardDexId> implements ModelCardDexId {
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
  cardEntity: Card;

  @Column({
    type: DataType.STRING,
  })
  dexId: string;
}
