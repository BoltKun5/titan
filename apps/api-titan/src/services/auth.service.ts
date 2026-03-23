import { HttpResponseError } from '../modules/http-response-error';
import jws from 'jsonwebtoken';
import { User } from '../database';
import AppConfig from '../modules/app-config.module';
import UserService from './user.service';
import bcrypt from 'bcryptjs';
import { IUser, SessionTokenPayload } from 'titan_core';
import { Service } from '../core';

type ParamsSignup = {
  mail: string;
  password: string;
  firstName: string;
  lastName: string;
  shownName: string;
};

type ParamsLogin = {
  mail: string;
  password: string;
};

type ResultLogin = {
  user: IUser;
  token: string;
};

class AuthService extends Service {
  public async signup({
    mail,
    password,
    firstName,
    lastName,
    shownName,
  }: ParamsSignup): Promise<User> {
    this.logger.log(`New user **${mail}** registered`);

    return UserService.create({
      mail,
      password,
      firstName,
      lastName,
      shownName,
    });
  }

  public async login({ mail, password }: ParamsLogin): Promise<ResultLogin> {
    const user: Partial<User> | null = await User.findOne({
      where: { mail },
    });

    if (!user) {
      throw HttpResponseError.createWrongUsernameError();
    }

    this.logger.log(`User ${user?.id} is logging in`);

    if (!user.isActive) {
      throw HttpResponseError.createInactiveAccountError();
    }

    const isCorrect = bcrypt.compareSync(password, user?.password as string);

    if (!isCorrect) throw HttpResponseError.createWrongPasswordError();

    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    return {
      user: user as IUser,
      token: this.token({ UUID: user.id }),
    };
  }

  public token(
    payload: Partial<SessionTokenPayload>,
    unlimited?: boolean,
  ): string {
    return jws.sign({ ...payload }, AppConfig.config.app.auth.secretToken, {
      ...(!unlimited
        ? { expiresIn: AppConfig.config.app.auth.expiration }
        : {}),
    });
  }
}
export default new AuthService();
