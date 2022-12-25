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
import { CustomModel } from '../custom/custom-model';
import { Tag } from './tag';
import { UserCardPossession } from './user-card-possession';

export type ModelUser = Overwrite<
  IUser,
  {
    cards: UserCardPossession[];
    tags: Tag[];
  }
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'user', paranoid: false, timestamps: true })
export class User extends CustomModel<ModelUser> implements ModelUser {
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
  cards: UserCardPossession[];

  @HasMany(() => Tag)
  tags: Tag[];
}
