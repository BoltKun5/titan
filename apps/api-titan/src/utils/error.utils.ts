import { HttpErrorCode, ErrorType } from 'titan_core';

type ErrorParams = { code: HttpErrorCode; type: ErrorType; message?: string } | string;

export class ServiceException extends Error {
  private readonly code: HttpErrorCode;

  private readonly type: ErrorType;

  getCode(): HttpErrorCode {
    return this.code;
  }

  getType(): ErrorType {
    return this.type;
  }

  constructor(params: ErrorParams) {
    if (typeof params === 'string') {
      super(params);
      return;
    }
    super(params.message);
    this.code = params.code;
    this.type = params.type;
  }
}

export const handleError = (error: Error | ErrorParams, _params?: ErrorParams): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new ServiceException(error);
};
