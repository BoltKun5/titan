import { AuthService } from './../../services/auth.service';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../../database';
import AuthValidation from '../validations/auth.validation';
import { token } from '../../utils/auth.utils';
import createError from "http-errors";
import { ErrorType, IResponse } from "abyss_crypt_core";
import { ISigninAuthBody, ISigninAuthResponse, IResponseLocals, ISignupAuthBody, ISignupAuthResponse } from '../../../../local-core/interface';
import express from 'src/loaders/express';

const route = Router();

export const AuthRouter = (app: Router): Router => {
  app.use('/auth', route);

  route.post(
    '/signin',
    asyncHandler(async (req: Request<any, any, ISigninAuthBody>, res: Response<IResponse<ISigninAuthResponse>, IResponseLocals>) => {
      req.body = AuthValidation.signinBody(req.body);

      res.cookie('test', 'aazezaezae', { domain: "localhost:3000" });
      const { user, token } = await AuthService.login({ username: req.body.username, password: req.body.password })

      res.json({
        data: {
          token: token,
          user: {
            shownName: user.shownName,
            id: user.id,
            role: user.role
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

      if (existingUser) {
        throw createError(409, {
          type: ErrorType.resourceError,
          code: "USERNAME_USED",
          message: 'Username already used.',
        });
      }

      const user = await AuthService.signup({ shownName: req.body.shownName, username: req.body.username, password: req.body.password })

      res.json({
        data: {
          token: token(user),
          user: {
            shownName: user.shownName,
            id: user.id,
            role: user.role
          },
        },
      });
    }),
  )

  return route;
};
