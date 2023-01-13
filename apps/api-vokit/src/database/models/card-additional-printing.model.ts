import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/custom-model.model';
import { Card } from './card';
import { WithRequired } from '../../core';
import {
  Overwrite,
  CardAdditionalPrintingTypeEnum,
  CardAdditionalPrintingCreatorEnum,
} from 'vokit_core';
import { ICardAdditionalPrinting } from 'vokit_core/src/types/interface/models/card-additional-printing.model';

export type ModelCardAdditionalPrinting = Overwrite<
  ICardAdditionalPrinting,
  {
    card: Card;
  }
>;

export type CreationModelCardAdditionalPrinting = WithRequired<
  Partial<ICardAdditionalPrinting>,
  'cardId' | 'type' | 'name' | 'creator'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardAdditionalPrinting', paranoid: false, timestamps: false })
export class CardAdditionalPrinting
  extends CustomModel<ICardAdditionalPrinting, CreationModelCardAdditionalPrinting>
  implements ModelCardAdditionalPrinting
{
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
  type: CardAdditionalPrintingTypeEnum;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
  })
  creator: CardAdditionalPrintingCreatorEnum;
}
