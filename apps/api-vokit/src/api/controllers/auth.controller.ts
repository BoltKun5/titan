import { Request, Response } from 'express';
import AuthValidation from '../validations/auth.validation';
import {
  ErrorType,
  IRenewPasswordBody,
  IResponse,
  ISigninAuthBody,
  ISigninAuthResponse,
  ISignupAuthBody,
  ISignupAuthResponse,
  PreSignedTypeEnum,
} from 'vokit_core';
import { Controller, LoggerModel, IResponseUnloggedLocals } from '../../core';
import authService from '../../services/auth.service';
import createError from 'http-errors';
import { User } from '../../database';
import jws from 'jsonwebtoken';
import AppConfig from '../../modules/app-config.module';
import mailService from '../../services/mail.service';
import { HttpResponseError } from '../../modules/http-response-error';

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
        user: {
          shownName: user.shownName,
          id: user.id,
          role: user.role,
        },
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

    const token = jws.sign(
      {
        mail: req.body.mail,
        password: req.body.password,
        type: PreSignedTypeEnum.CREATE_ACCOUNT,
      },
      AppConfig.config.app.auth.secretToken,
      {
        expiresIn: '7d',
      },
    );

    const user = await authService.signup({
      shownName: req.body.shownName,
      mail: req.body.mail,
      password: req.body.password,
    });

    await mailService.sendMail(
      req.body.mail,
      PreSignedTypeEnum.CREATE_ACCOUNT,
      `${process.env.FRONT_URL ?? ''}pre-signed?token=${token}`,
    );

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

  async renewPassword(
    req: Request<Record<string, never>, IResponse<void>, IRenewPasswordBody>,
    res: Response<IResponse<void>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.body = AuthValidation.renewPasswordBody(req.body);

    const user = User.findOne({ where: { mail: req.body.mail } });

    if (!user) throw HttpResponseError.createNotFoundError();

    const token = jws.sign(
      {
        mail: req.body.mail,
        type: PreSignedTypeEnum.RENEW_PASSWORD,
      },
      AppConfig.config.app.auth.secretToken,
      {
        expiresIn: '7d',
      },
    );

    await mailService.sendMail(
      req.body.mail,
      PreSignedTypeEnum.RENEW_PASSWORD,
      `${process.env.FRONT_URL ?? ''}pre-signed?token=${token}`,
    );

    res.send();
  }
}

export default new AuthController();
