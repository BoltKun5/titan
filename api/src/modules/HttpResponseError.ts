import { HttpErrorCode } from './../../../local-core/httpResponses/error';
import createError from 'http-errors';
import { Response, Request } from 'express';
import { IResponseLocals } from '../../../local-core';

export class HttpResponseError {

  public static createInternalServerError(): createError.HttpError {
    return createError(500, {
      code: HttpErrorCode.unknown,
      message: 'Internal Server Error'
    });
  }

  public static createUnauthorized(msg?: string): createError.HttpError {
    return createError(401, {
      code: HttpErrorCode.unauthorized,
      message: 'Unauthorized'
    });
  }

  public static createSignUpValidationError(): createError.HttpError {
    return createError(400, {
      code: HttpErrorCode.signupvalidation,
      message: 'submitted values are not valid'
    })
  }

  public static createUserNotFound(): createError.HttpError {
    return createError(404, {
      code: HttpErrorCode.invaliduser,
      message: 'user could not be found'
    })
  }

  public static createSignInValidationError(): createError.HttpError {
    return createError(400, {
      code: HttpErrorCode.signinvalidation,
      message: 'submitted values are not valid'
    })
  }

  public static createWrongPasswordError(): createError.HttpError {
    return createError(404, {
      code: HttpErrorCode.badpassword,
      message: 'the password is wrong'
    })
  }

  public static sendError(
    error: Error | createError.HttpError,
    req: Request,
    res: Response<any, IResponseLocals>,
  ): void {
    let errorToUse = error;

    const err = errorToUse as createError.HttpError;
    if (err.status === 500) console.error(err);
    res.status(err.status).json({
      error: err,
    });
  }
}
