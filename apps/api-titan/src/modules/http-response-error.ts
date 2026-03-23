import createError from 'http-errors';
import { Response, Request } from 'express';
import { ServiceException } from '../utils/error.utils';
import { HttpErrorCode } from 'titan_core';
import { ILocals } from '../core';

export class HttpResponseError {
  public static createInternalServerError(): createError.HttpError {
    return createError(500, {
      code: HttpErrorCode.unknown,
      message: 'Internal Server Error',
    });
  }

  public static createInactiveAccountError(): createError.HttpError {
    return createError(401, {
      code: HttpErrorCode.inactiveAccount,
      message: 'account not yet activated',
    });
  }

  public static createUnauthorized(): createError.HttpError {
    return createError(401, {
      code: HttpErrorCode.unauthorized,
      message: 'Unauthorized',
    });
  }

  public static createExpiredToken(): createError.HttpError {
    return createError(401, {
      code: HttpErrorCode.expired,
      message: 'Expired token',
    });
  }

  public static createSignUpValidationError(): createError.HttpError {
    return createError(400, {
      code: HttpErrorCode.signupvalidation,
      message: 'submitted values are not valid',
    });
  }

  public static createUserNotFound(): createError.HttpError {
    return createError(404, {
      code: HttpErrorCode.invaliduser,
      message: 'user could not be found',
    });
  }

  public static createValidationError(): createError.HttpError {
    return createError(400, {
      code: HttpErrorCode.signinvalidation,
      message: 'submitted values are not valid',
    });
  }

  public static createWrongPasswordError(): createError.HttpError {
    return createError(404, {
      code: HttpErrorCode.badpassword,
      message: 'the password is wrong',
    });
  }

  public static createWrongUsernameError(): createError.HttpError {
    return createError(404, {
      code: HttpErrorCode.badusername,
      message: `the username doesn't exist`,
    });
  }

  public static createWrongValuesError(): createError.HttpError {
    return createError(400, {
      code: HttpErrorCode.badvalues,
      message: 'submitted values are not valid',
    });
  }

  public static createNotFoundError(): createError.HttpError {
    return createError(404, {
      code: HttpErrorCode.badvalues,
      message: 'value not found',
    });
  }

  public static generateError(error: Error): createError.HttpError {
    if (error instanceof createError.HttpError) {
      return error;
    }

    if (error instanceof ServiceException) {
      return createError(
        error.getCode() === HttpErrorCode.notFound ? 404 : 400,
        {
          code: error.getCode(),
          type: error.getType(),
          message: error.message,
        },
      );
    }

    return HttpResponseError.createInternalServerError();
  }

  public static sendError(
    error: Error | createError.HttpError,
    req: Request,
    res: Response<any, ILocals>,
  ): void {
    const errorToUse = HttpResponseError.generateError(error);

    if (errorToUse.status >= 500) {
    }

    res.status(errorToUse.status).json({
      error: errorToUse,
    });
  }
}
