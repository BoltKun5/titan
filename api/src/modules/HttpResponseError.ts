import createError from 'http-errors';
import { Response, Request } from 'express';
import { IResponseLocals } from '../../../local-core';
import { ServiceException } from '../utils/error.utils';
import { ErrorType, Code } from 'abyss_crypt_core';

export class HttpResponseError {
  public static createInternalServerError(): createError.HttpError {
    return createError(500, ErrorType.apiError, Code.internalServerError, 'Internal Server Error');
  }

  public static createUnauthorized(msg?: string): createError.HttpError {
    return createError(401, ErrorType.authError, Code.tokenFailure, msg ?? 'Unauthorized');
  }

  public static createValidationError(validationMessage?: string): createError.HttpError {
    return createError(400, {
      type: ErrorType.resourceError,
      code: Code.validationError,
      message: 'Validation Error',
      params: {
        validationMessage,
      },
    });
  }

  public static createNotFound(): createError.HttpError {
    return createError(404, {
      type: ErrorType.resourceError,
      code: Code.notFound,
      message: 'Resource not found',
    });
  }

  public static createUserNotFound(): createError.HttpError {
    return createError(404, {
      type: ErrorType.resourceError,
      code: "USER_NOT_FOUND",
      message: 'Resource not found',
    });
  }

  public static generateError(error: Error): createError.HttpError {
    if (error instanceof createError.HttpError) return error;

    if (error instanceof ServiceException) {
      return createError(error.getCode() === Code.notFound ? 404 : 400, {
        code: error.getCode(),
        type: error.getType(),
        message: error.message,
      });
    }

    return HttpResponseError.createInternalServerError();
  }

  public static sendError(
    error: Error | createError.HttpError,
    req: Request,
    res: Response<any, IResponseLocals>,
  ): void {
    let errorToUse = error;

    if (error instanceof Error) errorToUse = HttpResponseError.generateError(error);

    const err = errorToUse as createError.HttpError;
    if (err.status === 500) console.error(err);
    res.status(err.status).json({
      error: err,
    });
  }
}
