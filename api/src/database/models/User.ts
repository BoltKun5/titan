import { Overwrite } from 'abyss_core';
import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../../../local-core/types';
import { CustomModel } from '../custom/CustomModel';
import { UserCardPossession } from './UserCardPossession';

export type ModelUser = Overwrite<IUser,
  {
    cards: UserCardPossession[],
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'User', paranoid: false, timestamps: true })
export class User extends CustomModel implements ModelUser {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  role: number;

  @Column({
    type: DataType.STRING,
  })
  shownName: string;

  @Column({
    type: DataType.STRING,
  })
  username: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;


  @HasMany(() => UserCardPossession)
  cards: UserCardPossession[]
}
