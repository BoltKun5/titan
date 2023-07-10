import { Request, Response } from 'express';
import {
  IGetPreSignedQuery,
  IGetPreSignedResponse,
  IResponse,
  ISignupAuthBody,
  IUpdatePasswordBody,
  PreSignedTypeEnum,
  Token,
} from 'vokit_core';
import { Controller, LoggerModel, IResponseUnloggedLocals } from '../../core';
import PreSignedValidation from '../validations/pre-signed.validation';
import { PreSignedUrl, User } from '../../database';
import { HttpResponseError } from '../../modules/http-response-error';
import jwt from 'jsonwebtoken';
import AppConfig from '../../modules/app-config.module';
import authService from '../../services/auth.service';
import bcrypt from 'bcryptjs';

class PreSignedController implements Controller {
  private static readonly logger = new LoggerModel(PreSignedController.name);

  async get(
    req: Request<Record<string, never>, IResponse<IGetPreSignedResponse>, void, IGetPreSignedQuery>,
    res: Response<IResponse<IGetPreSignedResponse>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.query = PreSignedValidation.getQuery(req.query);

    try {
      const usedToken = await PreSignedUrl.findOne({
        where: {
          token: req.query.token,
        },
      });

      if (usedToken) {
        throw new Error('TokenUsedError');
      }

      const decodedToken = <
        ((Token & ISignupAuthBody) | { mail: string }) & { type: PreSignedTypeEnum }
      >jwt.verify(req.query.token, AppConfig.config.app.auth.secretToken);

      if (decodedToken.type === PreSignedTypeEnum.CREATE_ACCOUNT) {
        await User.update({ isActive: true }, { where: { mail: decodedToken.mail } });

        const { user, token } = await authService.login({
          mail: decodedToken.mail,
          password: (decodedToken as Token & ISignupAuthBody).password,
        });

        await PreSignedUrl.create({
          token: req.query.token,
          type: PreSignedTypeEnum.CREATE_ACCOUNT,
        });

        res.json({
          data: {
            type: PreSignedTypeEnum.CREATE_ACCOUNT,
            data: {
              token: token,
              user,
            },
          },
        });

        return;
      }

      if (decodedToken.type === PreSignedTypeEnum.RENEW_PASSWORD) {
        res.json({
          data: {
            type: PreSignedTypeEnum.RENEW_PASSWORD,
            data: { mail: decodedToken.mail },
          },
        });

        return;
      }

      throw null;
    } catch (error: any) {
      console.log(error);
      if (error?.name === 'TokenExpiredError' || error?.name === 'TokenUsedError')
        throw HttpResponseError.createUnauthorized();
      throw HttpResponseError.createInternalServerError();
    }
  }

  async updatePassword(
    req: Request<Record<string, never>, IResponse<void>, IUpdatePasswordBody>,
    res: Response<IResponse<void>, IResponseUnloggedLocals>,
  ): Promise<void> {
    req.body = PreSignedValidation.updatePasswordBody(req.body);

    try {
      const usedToken = await PreSignedUrl.findOne({
        where: {
          token: req.body.token,
        },
      });

      if (usedToken) {
        throw new Error('TokenUsedError');
      }

      const decodedToken = <{ mail: string }>(
        jwt.verify(req.body.token, AppConfig.config.app.auth.secretToken)
      );

      const user = await User.findOne({ where: { mail: decodedToken.mail } });

      if (!user) {
        throw HttpResponseError.createNotFoundError();
      }

      const hash = bcrypt.hashSync(req.body.password, 12);

      user.password = hash;

      user.save();

      await PreSignedUrl.create({
        token: req.body.token,
        type: PreSignedTypeEnum.RENEW_PASSWORD,
      });

      res.send();
    } catch (error: any) {
      console.log(error);
      if (error?.message === 'TokenExpiredError' || error?.message === 'TokenUsedError')
        throw HttpResponseError.createUnauthorized();
      throw HttpResponseError.createInternalServerError();
    }
  }
}

export default new PreSignedController();
