import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as contentType from 'content-type';
import { IResponseLocals } from '../../local_core';
import { handleError, Code, ErrorType, SessionToken } from 'abyss_core';
import AppConfig from '../../modules/AppConfig';
import { User } from '../../database';
import { HttpResponseError } from '../../modules/HttpResponseError';

export default async (
  req: Request,
  res: Response<any, IResponseLocals>,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.headers['content-type']) {
      const contentT = contentType.parse({ headers: req.headers });
      const requestTypes = [
        'application/json',
        'multipart/form-data',
        'application/x-www-form-urlencoded',
      ];

      if (!requestTypes.includes(contentT.type))
        throw handleError({
          code: Code.invalidData,
          type: ErrorType.resourceError,
        });
    }

    if (!req.headers.authorization && !req.cookies.token)
      throw handleError({
        code: Code.authenticationFailure,
        type: ErrorType.authError,
      });

    const token: string = req.headers.authorization.split(' ')[1];
    const decodedToken = <SessionToken>jwt.verify(token, AppConfig.config.app.auth.secretToken);

    const { UUID } = decodedToken;

    const currentUser = await User.findOne({
      where: {
        id: UUID,
      },
    });

    if (!currentUser)
      throw handleError({
        code: Code.authenticationFailure,
        type: ErrorType.authError,
      });

    res.locals.currentUser = currentUser;

    next();
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError')
      return HttpResponseError.sendError(
        HttpResponseError.createUnauthorized('Token Expired'),
        req,
        res,
      );

    HttpResponseError.sendError(error, req, res);
  }
};
