import { CardPossessionHistoric } from './CardPossessionHistoric';
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
  BeforeCreate,
  BeforeUpdate,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { CustomModel } from '../custom/CustomModel';
import { User } from './User';
import { IUserCardPossession } from '../../../../local-core/types';
import { Overwrite } from 'abyss_core';

export type ModelUserCardPossession = Overwrite<IUserCardPossession,
  {
    user: User,
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'UserCardPossession', paranoid: false, timestamps: true })
export class UserCardPossession extends CustomModel implements ModelUserCardPossession {
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
  cardId: string;

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

  @HasMany(() => CardPossessionHistoric)
  types: CardPossessionHistoric[]
}
