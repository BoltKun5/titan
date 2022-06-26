import { IResponseLocals } from './../../local_core/types/api/IResponseLocals';
import { IResponse, ISigninAuthBody, ISigninAuthResponse } from './../../type/types/interface/api/auth.interface';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../../database';
import AuthValidation from '../validations/auth.validation';
import { token } from '../../utils/auth.utils';
import { ErrorType } from 'abyss_core';
import { handleError } from '../../utils/error.utils';
import { HttpResponseError } from '../../modules/HttpResponseError';

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
          username: req.body.username
        }
      });
      if (!user) {
        throw HttpResponseError.createNotFound()
      }

      res.json({
        data: {
          token: token(user),
          user: user
        }
      });
    }),
  );


  return route;
};
