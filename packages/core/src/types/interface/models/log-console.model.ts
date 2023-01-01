import { LogLevel, LogType } from '../..';
import { ILogEndpoint } from './log-endpoint.model';

export interface ILogConsole {
  id?: string;
  processId: number;
  context: string | null;
  requestId: string | null;
  level: LogLevel;
  message: string;
  stack: string | null;
  type: LogType;
  dateValue: Date;
  updatedAt?: Date;
  createdAt?: Date;

  // Associations
  logEndpoint?: ILogEndpoint;
}
