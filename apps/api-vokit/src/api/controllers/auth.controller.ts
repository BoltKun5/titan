import { Request, Response } from 'express';
import AuthValidation from '../validations/auth.validation';
import {
  ErrorType,
  IResponse,
  ISigninAuthBody,
  ISigninAuthResponse,
  ISignupAuthBody,
  ISignupAuthResponse,
} from 'vokit_core';
import { Controller, LoggerModel, IResponseUnloggedLocals } from '../../core';
import { User } from '../../database';
import authService from '../../services/auth.service';
import createError from 'http-errors';

class AuthController implements Controller {
  private static readonly logger = new LoggerModel(AuthController.name);

  async signIn(
    req: Request<Record<string, never>, IResponse<ISigninAuthResponse>, ISigninAuthBody>,
    res: Response<IResponse<ISigninAuthResponse>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.body = AuthValidation.signinBody(req.body);

    const { user, token } = await authService.login({
      username: req.body.username,
      password: req.body.password,
    });

    res.json({
      data: {
        token: token,
        user: {
          shownName: user.shownName,
          id: user.id,
          role: user.role,
        },
      },
    });
  }

  async signUp(
    req: Request<any, any, ISignupAuthBody>,
    res: Response<IResponse<ISignupAuthResponse>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.body = AuthValidation.signupBody(req.body);
    const existingUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (existingUser) {
      throw createError(409, {
        type: ErrorType.resourceError,
        code: 'USERNAME_USED',
        message: 'Username already used.',
      });
    }

    const user = await authService.signup({
      shownName: req.body.shownName,
      username: req.body.username,
      password: req.body.password,
    });

    res.json({
      data: {
        token: authService.token({ UUID: user.id }),
        user: {
          shownName: user.shownName,
          id: user.id,
          role: user.role,
        },
      },
    });
  }
}

export default new AuthController();
