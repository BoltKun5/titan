import { Request, Response } from 'express';
import AuthValidation from '../validations/auth.validation';
import {
  ErrorType,
  IResponse,
  ISigninAuthBody,
  ISigninAuthResponse,
  ISignupAuthBody,
  ISignupAuthResponse,
} from 'titan_core';
import { Controller, LoggerModel, IResponseUnloggedLocals } from '../../core';
import authService from '../../services/auth.service';
import createError from 'http-errors';
import { User } from '../../database';

class AuthController implements Controller {
  private static readonly logger = new LoggerModel(AuthController.name);

  async signIn(
    req: Request<Record<string, never>, IResponse<ISigninAuthResponse>, ISigninAuthBody>,
    res: Response<IResponse<ISigninAuthResponse>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.body = AuthValidation.signinBody(req.body);

    const { user, token } = await authService.login({
      mail: req.body.mail,
      password: req.body.password,
    });

    res.json({
      data: {
        token: token,
        user,
      },
    });
  }

  async signUp(
    req: Request<Record<string, never>, IResponse<ISignupAuthResponse>, ISignupAuthBody>,
    res: Response<IResponse<ISignupAuthResponse>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.body = AuthValidation.signupBody(req.body);

    const existingUser = await User.findOne({
      where: {
        mail: req.body.mail,
      },
    });

    if (existingUser) {
      throw createError(409, {
        type: ErrorType.resourceError,
        code: 'MAIL_USED',
        message: 'Email already used.',
      });
    }

    const user = await authService.signup({
      shownName: req.body.shownName,
      mail: req.body.mail,
      password: req.body.password,
    });

    res.json({
      data: {
        token: authService.token({ UUID: user.id }),
        user,
      },
    });
  }
}

export default new AuthController();
