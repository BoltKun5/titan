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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { User } from './User';

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'UserCardPossession', paranoid: false, timestamps: true })
export class UserCardPossession extends CustomModel {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;


  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User


  @ForeignKey(() => Card)
  @Column({
    type: DataType.STRING,
  })
  cardId: Card;

  @BelongsTo(() => Card)
  card: Card


  @Column({
    type: DataType.INTEGER,
  })
  classicQuantity: number;


  @Column({
    type: DataType.INTEGER,
  })
  reverseQuantity: number;
}
