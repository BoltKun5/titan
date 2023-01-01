import { HttpErrorCode, ErrorType } from '../../../../enums';

export interface IApiError {
  type: ErrorType;
  code: HttpErrorCode;
  message: string;
  params?: string;
  field?: string;
}
