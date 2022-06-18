import { IResponse } from 'abyss_crypt_core';

export interface IResponseLocals {
  responseBody?: IResponse<any>;
  byteSize: number;
  controller: string;
  timer: {
    start: Date;
    startTime: [number, number];
    durationToFinish?: number;
    durationToClose?: number;
  };
}
