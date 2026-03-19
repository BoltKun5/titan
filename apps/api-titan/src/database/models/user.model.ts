import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IUser, Overwrite } from 'titan_core';
import { WithRequired } from '../../core';
import { CustomModel } from '../custom/custom-model.model';

export type ModelUser = Overwrite<IUser, {}>;

export type CreationModelUser = WithRequired<
  Partial<IUser>,
  'role' | 'shownName' | 'mail' | 'password'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'user', paranoid: false, timestamps: true })
export class User extends CustomModel<IUser, CreationModelUser> implements ModelUser {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  role: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  shownName: string;

  @Column({
    type: DataType.STRING,
  })
  mail: string;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
  })
  options: Record<string, string>;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;
}
