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

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'CardDexId', paranoid: false, timestamps: false })
export class CardDexId extends CustomModel {
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
  cardEntity: Card


  @Column({
    type: DataType.STRING,
  })
  dexId: string;
}
