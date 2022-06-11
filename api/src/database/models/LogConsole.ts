/* eslint-disable @typescript-eslint/indent */
import {
  DataType,
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  DefaultScope,
  Scopes,
  Default,
  HasOne,
} from 'sequelize-typescript';
import AbyssCore from 'abyss_core';
import { v4 as uuidv4 } from 'uuid';
import { LogEndpoint } from '..';
import { CustomModel } from '../custom/CustomModel';
import { ILogConsole, LogLevel, LogType } from 'abyss_crypt_core';

export type ModelLogConsole = AbyssCore.BaseEntity<
  AbyssCore.Overwrite<
    ILogConsole,
    {
      logEndpoint: LogEndpoint;
    }
  >
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'logConsole', paranoid: false, timestamps: true })
export class LogConsole extends CustomModel implements ModelLogConsole {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  level: LogLevel;

  @Default(LogType.OTHER)
  @Column({
    type: DataType.INTEGER,
  })
  type: LogType;

  @Column({
    type: DataType.TEXT,
  })
  message: string;

  @Column({
    type: DataType.TEXT,
  })
  stack: string;

  @Default(() => new Date())
  @Column({
    type: DataType.DATE,
  })
  dateValue: Date;

  @HasOne(() => LogEndpoint)
  logEndpoint: LogEndpoint;
}
