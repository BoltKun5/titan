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
import { v4 as uuidv4 } from 'uuid';
import { LogConsole } from '..';
import { CustomModel } from '../custom/custom-model.model';
import { ILogEndpoint, APIMethod, Overwrite } from 'vokit_core';
import { BaseEntity, WithRequired } from '../../core';

export type ModelLogEndpoint = BaseEntity<
  Overwrite<
    ILogEndpoint,
    {
      logConsole: LogConsole;
    }
  >
>;

export type CreationModelLogEndpoint = WithRequired<
  Partial<ILogEndpoint>,
  | 'requestId'
  | 'controller'
  | 'endpoint'
  | 'ips'
  | 'durationInMs'
  | 'httpResultCode'
  | 'method'
  | 'requestParams'
  | 'requestQuery'
  | 'requestBody'
  | 'responseBody'
  | 'logConsoleId'
>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'logEndpoint', paranoid: false, timestamps: true })
export class LogEndpoint
  extends CustomModel<ILogEndpoint, CreationModelLogEndpoint>
  implements ModelLogEndpoint
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
  })
  requestId: string;

  @Default(() => process.pid)
  @Column({
    type: DataType.INTEGER,
  })
  processId: number;

  @Column({
    type: DataType.STRING,
  })
  controller: string;

  @Column({
    type: DataType.STRING,
  })
  endpoint: string;

  @Column({
    type: DataType.JSON,
  })
  ips: string[];

  @Column({
    type: DataType.DECIMAL,
  })
  durationInMs: number;

  @Column({
    type: DataType.INTEGER,
  })
  method: APIMethod;

  @Column({
    type: DataType.JSON,
  })
  requestParams: Record<string, unknown>;

  @Column({
    type: DataType.JSON,
  })
  requestQuery: Record<string, unknown>;

  @Column({
    type: DataType.JSON,
  })
  requestBody: Record<string, unknown>;

  @Column({
    type: DataType.JSON,
  })
  responseBody: Record<string, unknown>;

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
