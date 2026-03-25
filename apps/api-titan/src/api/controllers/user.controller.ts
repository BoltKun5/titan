import {
  IGetUserByIdQuery,
  IUpdateOptionBody,
  IUpdateShownNameBody,
  IUpdateUserPasswordBody,
  IUpdateBioBody,
} from 'titan_core';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import userService from '../../services/user.service';
import { Controller, ILocals, LoggerModel } from '../../core';
import { IMeUserResponse, IUserResponse } from 'titan_core';
import UserValidation from '../validations/user.validation';
import { User } from '../../database';
import { HttpResponseError } from '../../modules/http-response-error';

class UserController implements Controller {
  private static readonly logger = new LoggerModel(UserController.name);

  async me(
    _req: Request<Record<string, never>, IMeUserResponse, void>,
    res: Response<IMeUserResponse, ILocals>,
  ): Promise<void> {
    UserController.logger.log(`Connected ${res.locals.currentUser.id}`);

    const user = await userService.getUser(
      { user: { id: res.locals.currentUser.id } },
      undefined,
      {
        attributes: {
          exclude: ['createdAt', 'password', 'updatedAt', 'username'],
        },
      },
    );

    res.status(200).json({
      user: user,
    });
  }

  async search(
    req: Request<
      Record<string, never>,
      { users: Partial<User>[] },
      void,
      { q?: string }
    >,
    res: Response<{ users: Partial<User>[] }, ILocals>,
  ): Promise<void> {
    const q = (req.query.q || '').trim();
    if (q.length < 1) {
      res.json({ users: [] });
      return;
    }

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: res.locals.currentUser.id },
        [Op.or]: [
          { shownName: { [Op.iLike]: `%${q}%` } },
          { firstName: { [Op.iLike]: `%${q}%` } },
          { lastName: { [Op.iLike]: `%${q}%` } },
        ],
      },
      attributes: ['id', 'shownName', 'firstName', 'lastName'],
      limit: 20,
    });

    res.json({ users });
  }

  async getById(
    req: Request<Record<string, never>, IUserResponse, void, IGetUserByIdQuery>,
    res: Response<IUserResponse, ILocals>,
  ): Promise<void> {
    req.query = UserValidation.getByIdQuery(req.query);

    UserController.logger.log(`Getting ${req.query.id} profile by Id`);

    const user = await User.findOne({
      where: {
        id: req.query.id,
      },
      attributes: {
        exclude: ['createdAt', 'password', 'updatedAt', 'mail', 'role'],
      },
    });

    if (!user) {
      throw HttpResponseError.createNotFoundError();
    }

    res.json({
      user: user,
    });
  }

  async updateShownName(
    req: Request<Record<string, never>, IUserResponse, IUpdateShownNameBody>,
    res: Response<IUserResponse, ILocals>,
  ): Promise<void> {
    req.body = UserValidation.updateShownNameBody(req.body);

    UserController.logger.log(
      `User ${res.locals.currentUser.id} is updating his shown name`,
    );

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

    UserController.logger.log(
      `User ${res.locals.currentUser.id} is updating his password`,
    );

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

    UserController.logger.log(
      `User ${res.locals.currentUser.id} is updating his options`,
    );

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

  async updateBio(
    req: Request<Record<string, never>, IUserResponse, IUpdateBioBody>,
    res: Response<IUserResponse, ILocals>,
  ): Promise<void> {
    req.body = UserValidation.updateBioBody(req.body);

    const user = await User.findOne({
      where: { id: res.locals.currentUser.id },
      attributes: { exclude: ['createdAt', 'password', 'updatedAt'] },
    });

    if (!user) {
      throw HttpResponseError.createNotFoundError();
    }

    user.bio = req.body.bio || null;
    await user.save();
    await user.reload({
      attributes: { exclude: ['createdAt', 'password', 'updatedAt'] },
    });

    res.json({ user });
  }

  async uploadAvatar(
    req: Request,
    res: Response<IUserResponse, ILocals>,
  ): Promise<void> {
    if (!req.file) {
      throw HttpResponseError.createValidationError();
    }

    const user = await User.findOne({
      where: { id: res.locals.currentUser.id },
      attributes: { exclude: ['createdAt', 'password', 'updatedAt'] },
    });

    if (!user) {
      throw HttpResponseError.createNotFoundError();
    }

    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.save();
    await user.reload({
      attributes: { exclude: ['createdAt', 'password', 'updatedAt'] },
    });

    res.json({ user });
  }
}

export default new UserController();
