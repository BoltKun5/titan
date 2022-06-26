import { IResponse } from 'abyss_crypt_core';
import { User } from '../../../database';

export interface IResponseLocals {
  currentUser: User,
  responseBody?: IResponse<any>;
  controller: string;
  timer: {
    start: Date;
    startTime: [number, number];
    durationToFinish?: number;
    durationToClose?: number;
  };
}
