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
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import AbyssCore from 'abyss_core';
import { v4 as uuidv4 } from 'uuid';
import { LogConsole } from '..';
import { CustomModel } from '../custom/CustomModel';
import { APIMethod, ILogEndpoint } from 'abyss_crypt_core';

export type ModelLogEndpoint = AbyssCore.BaseEntity<
  AbyssCore.Overwrite<
    ILogEndpoint,
    {
      logConsole: LogConsole;
    }
  >
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'logEndpoint', paranoid: false, timestamps: true })
export class LogEndpoint extends CustomModel implements ModelLogEndpoint {
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
  })
  controller: string;

  @Column({
    type: DataType.STRING,
  })
  endpoint: string;

  @Column({
    type: DataType.STRING,
  })
  ip: string;

  @Column({
    type: DataType.DECIMAL,
  })
  durationMs: number;

  @Column({
    type: DataType.INTEGER,
  })
  method: APIMethod;

  @Column({
    type: DataType.TEXT,
  })
  requestParams: string;

  @Column({
    type: DataType.TEXT,
  })
  requestQuery: string;

  @Column({
    type: DataType.TEXT,
  })
  requestBody: string;

  @Column({
    type: DataType.TEXT,
  })
  responseBody: string;

  @Column({
    type: DataType.INTEGER,
  })
  httpResultCode: number;

  @Default(() => new Date())
  @Column({
    type: DataType.DATE,
  })
  dateValue: Date;

  @ForeignKey(() => LogConsole)
  @Column({
    type: DataType.STRING,
  })
  logConsoleId: string;

  @BelongsTo(() => LogConsole)
  logConsole: LogConsole;
}
