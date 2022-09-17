import { User } from "./../../../api/src/database";

export interface IResponse<T> {
  data?: T;
  error?: IApiError | Error | ICodeError;
}

export interface ICodeError {
  code: string
}

export interface IApiError {
  code: string;
  message: string;
  params?: string;
  field?: string;
}

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