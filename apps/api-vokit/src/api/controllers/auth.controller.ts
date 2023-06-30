import { Request, Response } from 'express';
import AuthValidation from '../validations/auth.validation';
import {
  ErrorType,
  IPreSignupAuthBody,
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
import dayjs from 'dayjs';
import { PreSignedUrl, User } from '../../database';
import mailService from '../../services/mail.service';

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
    const preSigned = await PreSignedUrl.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!preSigned) {
      throw createError(410, {
        type: ErrorType.resourceError,
        code: 'EXPIRED_LINK',
        message: 'The link has expired.',
      });
    }

    const user = await authService.signup({
      shownName: req.body.shownName,
      mail: preSigned.mail,
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

  async preSignUp(
    req: Request<Record<string, never>, IResponse<void>, IPreSignupAuthBody>,
    res: Response<IResponse<void>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.body = AuthValidation.preSignupBody(req.body);
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

    let preSigned = await PreSignedUrl.findOne({
      where: {
        mail: req.body.mail,
      },
    });

    if (preSigned) {
      await preSigned.update({
        expirationDate: dayjs().add(7, 'day').toDate(),
      });
    } else {
      preSigned = await PreSignedUrl.create({
        type: PreSignedTypeEnum.CREATE_ACCOUNT,
        mail: req.body.mail,
        expirationDate: dayjs().add(7, 'day').toDate(),
      });
    }

    await mailService.sendMail(
      req.body.mail,
      PreSignedTypeEnum.CREATE_ACCOUNT,
      `${process.env.FRONT_URL ?? ''}pre-signed/${preSigned.id}`,
    );

    res.send();
  }
}

export default new AuthController();
