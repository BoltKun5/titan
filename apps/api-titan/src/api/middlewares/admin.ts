import { ILocals } from './../../core/types/index';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as contentType from 'content-type';
import AppConfig from '../../modules/app-config.module';
import { User } from '../../database';
import { HttpResponseError } from '../../modules/http-response-error';
import { SessionToken } from 'titan_core';

export default async (
  req: Request,
  res: Response<any, ILocals>,
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
      if (!requestTypes.includes(contentT.type)) throw HttpResponseError.createUnauthorized();
    }

    if (!req.headers.authorization && !req.cookies.token)
      throw HttpResponseError.createUnauthorized();

    const token: string = req?.headers?.authorization?.split(' ')[1] ?? '';
    const decodedToken = <SessionToken>jwt.verify(token, AppConfig.config.app.auth.secretToken);

    const { UUID } = decodedToken;

    const currentUser = await User.findOne({
      where: {
        id: UUID,
      },
    });

    if (!currentUser) throw HttpResponseError.createUnauthorized();

    if (currentUser.role !== 1) throw HttpResponseError.createUnauthorized();

    res.locals.currentUser = currentUser;

    next();
  } catch (error: any) {
    console.error(error);
    if (error.name === 'TokenExpiredError')
      return HttpResponseError.sendError(HttpResponseError.createUnauthorized(), req, res);

    HttpResponseError.sendError(error, req, res);
  }
};
