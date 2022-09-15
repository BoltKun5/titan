import { UserCardPossession } from './UserCardPossession';
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
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { Card } from './Card';


@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'CardPossessionHistoric', paranoid: false, timestamps: true })
export class CardPossessionHistoric extends CustomModel {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @ForeignKey(() => UserCardPossession)
  @Column({
    type: DataType.STRING,
  })
  cardPossessionId: string;
  @BelongsTo(() => UserCardPossession)
  cardPossession: UserCardPossession

  @Column({
    type: DataType.STRING,
  })
  boosterId: string;

  @Column({
    type: DataType.INTEGER,
  })
  oldClassicQuantity: number;

  @Column({
    type: DataType.INTEGER,
  })
  newClassicQuantity: number;

  @Column({
    type: DataType.INTEGER,
  })
  oldReverseQuantity: number;

  @Column({
    type: DataType.INTEGER,
  })
  newReverseQuantity: number;


}