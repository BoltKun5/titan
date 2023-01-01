import { Code, ErrorType } from 'abyss_crypt_core';

type ErrorParams = { code: Code; type: ErrorType; message?: string } | string;

export class ServiceException extends Error {
  private readonly code: Code;

  private readonly type: ErrorType;

  getCode(): Code {
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
