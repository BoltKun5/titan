import { Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
import userService from '../../services/user.service';
import { Controller, ILocals, LoggerModel } from '../../core';
import { IMeUserResponse } from 'vokit_core';

class UserController implements Controller {
  private static readonly logger = new LoggerModel(UserController.name);

  async me(
    req: Request<Record<string, never>, IMeUserResponse, void>,
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

  // async update(
  //   req: Request<IUpdateUserParams, IUpdateUserResponse, IUpdateUserBody>,
  //   res: Response<IUpdateUserResponse, ILocals>,
  // ): Promise<void> {
  //   req.params = UserValidation.updateParams(req.params);
  //   req.body = UserValidation.updateBody(req.body);

  //   const { currentUser } = res.locals;
  //   const { password } = req.body;

  //   UserController.logger.log(`User ${res.locals.currentUser.id} is updating his profile`);

  //   await userService.update({
  //     ...req.body,
  //     ...(password ? { password: bcrypt.hashSync(password, 12) } : {}),
  //     user: currentUser,
  //   });

  //   res.status(200).json({
  //     data: {
  //       user: currentUser,
  //     },
  //   });
  // }
}

export default new UserController();
