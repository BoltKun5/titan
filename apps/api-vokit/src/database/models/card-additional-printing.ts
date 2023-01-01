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
import { Overwrite } from 'abyss_core';
import { Card } from './card';
import { ICardAdditionalPrinting } from '../../../../local-core/types/models/card-additional-printing.dto';
import {
  CardAdditionalPrintingCreatorEnum,
  CardAdditionalPrintingTypeEnum,
} from '../../../../local-core/enums';

export type ModelCardAdditionalPrinting = Overwrite<
  ICardAdditionalPrinting,
  {
    card: Card;
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'cardAdditionalPrinting', paranoid: false, timestamps: false })
export class CardAdditionalPrinting
  extends CustomModel<ModelCardAdditionalPrinting>
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
