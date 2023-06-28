import { HttpResponseError } from '../modules/http-response-error';
import jws from 'jsonwebtoken';
import { User } from '../database';
import AppConfig from '../modules/app-config.module';
import UserService from './user.service';
import bcrypt from 'bcryptjs';
import { SessionTokenPayload } from 'vokit_core';
import { Service } from '../core';

type ParamsSignup = {
  mail: string;
  password: string;
  shownName: string;
};

type ParamsLogin = {
  mail: string;
  password: string;
};

type ResultLogin = {
  user: User;
  token: string;
};

class AuthService extends Service {
  public async signup({ mail, password, shownName }: ParamsSignup): Promise<User> {
    this.logger.log(`New user **${mail}** registered`);

    return UserService.create({
      mail,
      password,
      shownName,
    });
  }

  public async login({ mail, password }: ParamsLogin): Promise<ResultLogin> {
    const user = await User.findOne({
      where: { mail },
    });

    if (!user) {
      throw HttpResponseError.createWrongUsernameError();
    }

    const isCorrect = bcrypt.compareSync(password, user.password);

    if (!isCorrect) throw HttpResponseError.createWrongPasswordError();

    return {
      user,
      token: this.token({ UUID: user.id }),
    };
  }

  public token(payload: Partial<SessionTokenPayload>, unlimited?: boolean): string {
    return jws.sign({ ...payload }, AppConfig.config.app.auth.secretToken, {
      ...(!unlimited ? { expiresIn: AppConfig.config.app.auth.expiration } : {}),
    });
  }
}
export default new AuthService();
