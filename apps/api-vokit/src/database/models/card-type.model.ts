import { Card } from './card.model';
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
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { Overwrite, ICardType, CardTypeEnum } from 'vokit_core';
import { WithRequired } from '../../core';

export type ModelCardType = Overwrite<
  ICardType,
  {
    card: Card;
  }
>;

export type CreationModelCardType = WithRequired<Partial<ICardType>, 'cardId' | 'type'>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardType', paranoid: false, timestamps: false })
export class CardType
  extends CustomModel<ICardType, CreationModelCardType>
  implements ModelCardType
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Index
  @ForeignKey(() => Card)
  @Column({
    type: DataType.STRING,
  })
  cardId: string;

  @BelongsTo(() => Card, { onDelete: 'CASCADE' })
  card: Card;

  @Column({
    type: DataType.INTEGER,
  })
  type: CardTypeEnum;
}
