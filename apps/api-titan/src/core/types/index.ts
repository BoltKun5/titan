import { IResponse, TitanRole } from 'titan_core';
import { User } from '../../database';
export * from './abstract';
export * from './database.utils';

export type ILocals = {
  currentUser: User;
  clubRole?: TitanRole;
} & ILocalLogger;

export type IResponseUnloggedLocals = ILocalLogger;

type ILocalTimer = {
  start: Date;
  startTime: [number, number];
  durationToFinish?: number;
  durationToClose?: number;
};

type ILocalLogger = {
  responseBody?: IResponse<Record<string, unknown>>;
  controller: string;
  timer: ILocalTimer;
  isAdmin: boolean;
};
