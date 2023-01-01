import { IApiError } from './api-error';

export interface IResponse<T> {
  data: T;
  error?: IApiError | Error;
}
