import { IResponse } from 'abyss_crypt_core';
import { Cryption } from '../../../database';

export interface IResponseLocals {
  responseBody?: IResponse<any>;
  cryption: Cryption;
  byteSize: number;
  controller: string;
  timer: {
    start: Date;
    startTime: [number, number];
    durationToFinish?: number;
    durationToClose?: number;
  };
}
