import {IResponseLocals} from '../../local_core';
import {
  IResponse,
  ISigninAuthBody,
  ISigninAuthResponse, ISignupAuthBody,
  ISignupAuthResponse,
} from '../../local_core/types/types/interface';
import {Request, Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {User} from '../../database';
import AuthValidation from '../validations/auth.validation';
import {token} from '../../utils/auth.utils';
import {HttpResponseError} from '../../modules/HttpResponseError';

const route = Router();

export const AuthRouter = (app: Router): Router => {
  app.use('/auth', route);

  route.get(
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
        throw HttpResponseError.createNotFound()
      }

      res.json({
        data: {
          token: token(user),
          user: user,
        },
      });
    }),
  );

  route.post(
    '/signup',
    asyncHandler(async (req: Request<any, any, ISignupAuthBody>, res: Response<IResponse<ISignupAuthResponse>, IResponseLocals>) => {
      req.body = AuthValidation.signupBody(req.body);
      const user = await User.create({
        password: req.body.password,
        username: req.body.username,
        showName: req.body.shownName,
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
