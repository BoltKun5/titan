import { Card } from './Card';
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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { CardTypeEnum } from '../../../../local-core';

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'CardType', paranoid: false, timestamps: false })
export class CardType extends CustomModel {
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
  card: Card


  @Column({
    type: DataType.INTEGER,
  })
  type: CardTypeEnum;

}
