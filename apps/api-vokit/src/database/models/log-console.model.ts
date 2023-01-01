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
  AllowNull,
} from 'sequelize-typescript';
import AbyssCore, { LogLevel, WithRequired } from 'abyss_core';
import { v4 as uuidv4 } from 'uuid';
import { LogEndpoint } from '..';
import { CustomModel } from '../custom/custom-model.model';
import { ILogConsole, LogType } from 'abyss_storage_core';

export type ModelLogConsole = AbyssCore.BaseEntity<
  AbyssCore.Overwrite<
    ILogConsole,
    {
      logEndpoint: LogEndpoint;
    }
  >
>;

export type CreationModelLogConsole = WithRequired<Partial<ILogConsole>, 'level' | 'message'>;

@DefaultScope(() => ({}))
@Scopes(() => ({}))
@Table({ tableName: 'logConsole', paranoid: false, timestamps: true })
export class LogConsole
  extends CustomModel<ILogConsole, CreationModelLogConsole>
  implements ModelLogConsole
{
  @IsUUID(4)
  @PrimaryKey
  @Default(() => uuidv4())
  @Column
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  level: LogLevel;

  @Default(() => process.pid)
  @Column({
    type: DataType.INTEGER,
  })
  processId: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  context: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  requestId: string | null;

  @Default(LogType.OTHER)
  @Column({
    type: DataType.INTEGER,
  })
  type: LogType;

  @Column({
    type: DataType.TEXT,
  })
  message: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  stack: string | null;

  @Default(() => new Date())
  @Column({
    type: DataType.DATE,
  })
  dateValue: Date;

  @HasOne(() => LogEndpoint)
  logEndpoint: LogEndpoint;
}
