import {
  IUpdateOptionBody,
  IUpdateShownNameBody,
  IUpdateUserPasswordBody,
} from './../../../../../packages/core/src/types/interface/api/requests/user.request';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userService from '../../services/user.service';
import { Controller, ILocals, LoggerModel } from '../../core';
import { IMeUserResponse, IUserResponse } from 'vokit_core';
import UserValidation from '../validations/user.validation';
import { User } from '../../database';
import { HttpResponseError } from '../../modules/http-response-error';

class UserController implements Controller {
  private static readonly logger = new LoggerModel(UserController.name);

  async me(
    _req: Request<Record<string, never>, IMeUserResponse, void>,
    res: Response<IMeUserResponse, ILocals>,
  ): Promise<void> {
    const user = await userService.getUser({ user: { id: res.locals.currentUser.id } }, undefined, {
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt', 'username'],
      },
    });

    res.status(200).json({
      user: user,
    });
  }

  async updateShownName(
    req: Request<Record<string, never>, IUserResponse, IUpdateShownNameBody>,
    res: Response<IUserResponse, ILocals>,
  ): Promise<void> {
    req.body = UserValidation.updateShownNameBody(req.body);

    UserController.logger.log(`User ${res.locals.currentUser.id} is updating his shown name`);

    let user = await User.findOne({
      where: {
        id: res.locals.currentUser.id,
      },
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    if (!user) {
      throw HttpResponseError.createNotFoundError();
    }

    user.shownName = req.body.shownName;

    await user.save();
    user = await user.reload({
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    res.json({
      user: user,
    });
  }

  async updatePassword(
    req: Request<Record<string, never>, IUserResponse, IUpdateUserPasswordBody>,
    res: Response<IUserResponse, ILocals>,
  ): Promise<void> {
    req.body = UserValidation.updatePasswordBody(req.body);

    UserController.logger.log(`User ${res.locals.currentUser.id} is updating his password`);

    const user = await User.findOne({
      where: {
        id: res.locals.currentUser.id,
      },
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    if (!user) {
      throw HttpResponseError.createNotFoundError();
    }

    const hash = bcrypt.hashSync(req.body.password, 12);

    user.password = hash;

    await user.save();
    await user.reload({
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    res.json({
      user: user,
    });
  }

  async updateOption(
    req: Request<Record<string, never>, IUserResponse, IUpdateOptionBody>,
    res: Response<IUserResponse, ILocals>,
  ): Promise<void> {
    req.body = UserValidation.updateOptionBody(req.body);

    UserController.logger.log(`User ${res.locals.currentUser.id} is updating his options`);

    const user = await User.findOne({
      where: {
        id: res.locals.currentUser.id,
      },
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    if (!user) {
      throw HttpResponseError.createNotFoundError();
    }

    const options = user.options;

    user.options = {
      ...options,
      ...req.body,
    };

    await user.save();
    await user.reload({
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt'],
      },
    });

    res.json({
      user: user,
    });
  }
}

export default new UserController();
