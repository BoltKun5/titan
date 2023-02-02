import { ILocals } from '../../core/types/index';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as contentType from 'content-type';
import AppConfig from '../../modules/app-config.module';
import { User } from '../../database';
import { SessionToken } from 'vokit_core';

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
      if (!requestTypes.includes(contentT.type)) return next();
    }

    if ((!req.headers.authorization && !req.cookies.token) || req.cookies.token === '')
      return next();

    const token: string | undefined = req.headers.authorization?.split(' ')[1] ?? undefined;
    if (!token || token === 'null') return next();
    const decodedToken = <SessionToken>jwt.verify(token, AppConfig.config.app.auth.secretToken);

    const { UUID } = decodedToken;

    const currentUser = await User.findOne({
      where: {
        id: UUID,
      },
    });

    if (!currentUser) return next();

    res.locals.currentUser = currentUser;

    next();
  } catch (error: any) {
    console.error(error);
    if (error.name === 'TokenExpiredError') return next();
  }
};
