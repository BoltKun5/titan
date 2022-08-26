import {ErrorType} from "abyss_core";

export interface IResponse<T> {
  data?: T;
  error?: IApiError | Error | ICodeError;
}

export interface ICodeError {
  code: string
}

export interface IApiError {
  type: ErrorType;
  code: string;
  message: string;
  params?: string;
  field?: string;
}
