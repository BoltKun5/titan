import {
  IResponse,
  IResponseLocals,
  ISigninAuthBody,
  ISigninAuthResponse, ISignupAuthBody,
  ISignupAuthResponse,
} from '@local-core';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../../database';
import AuthValidation from '../validations/auth.validation';
import { token } from '../../utils/auth.utils';
import { HttpResponseError } from '../../modules/HttpResponseError';
import createError from "http-errors";
import { ErrorType } from "abyss_crypt_core";

const route = Router();

export const AuthRouter = (app: Router): Router => {
  app.use('/auth', route);

  route.post(
    '/signin',
    asyncHandler(async (req: Request<any, any, ISigninAuthBody>, res: Response<IResponse<ISigninAuthResponse>, IResponseLocals>) => {
      req.body = AuthValidation.signinBody(req.body);
      const user = await User.findOne({
        where: {
          password: req.body.password,
          username: req.body.username,
        },
      });
      if (!user) {
        throw HttpResponseError.createUserNotFound()
      }

      res.json({
        data: {
          token: token(user),
          user: {
            shownName: user.shownName,
            id: user.id,
          },
        },
      });
    }),
  );

  route.post(
    '/signup',
    asyncHandler(async (req: Request<any, any, ISignupAuthBody>, res: Response<IResponse<ISignupAuthResponse>, IResponseLocals>) => {
      req.body = AuthValidation.signupBody(req.body);
      const existingUser = await User.findOne({
        where: {
          username: req.body.username,
        },
      });

      //TODO: créer des fonctions pour les erreurs
      if (existingUser) {
        throw createError(409, {
          type: ErrorType.resourceError,
          code: "USERNAME_USED",
          message: 'Username already used.',
        });
      }

      const user = await User.create({
        password: req.body.password,
        username: req.body.username,
        shownName: req.body.shownName,
        role: 0,
      });

      res.json({
        data: {
          token: token(user),
          user: user,
        },
      });
    }),
  )

  return route;
};
