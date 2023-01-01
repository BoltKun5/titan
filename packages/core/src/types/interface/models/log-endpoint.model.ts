import { ILogConsole } from '..';
import { APIMethod } from '../../enum';

export interface ILogEndpoint {
  id?: string;
  requestId: string;
  processId: number;
  controller: string | null;
  endpoint: string;
  requestParams: Record<string, unknown>;
  requestQuery: Record<string, unknown>;
  requestBody: Record<string, unknown>;
  responseBody: Record<string, unknown>;
  httpResultCode: number;
  ips: string[];
  durationInMs: number;
  method: APIMethod;
  dateValue: Date;
  logConsoleId?: string;
  updatedAt?: Date;
  createdAt?: Date;

  // Associations
  logConsole?: ILogConsole;
}
