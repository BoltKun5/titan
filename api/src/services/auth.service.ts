import { HttpResponseError } from './../modules/HttpResponseError';
import jws from 'jsonwebtoken';
import { SessionTokenPayload } from "abyss_core";
import { User } from "../../src/database";
import AppConfig from "../../src/modules/AppConfig";
import { UserService } from "./user.service";
import bcrypt from 'bcryptjs'
import Logger from '../../src/modules/Logger';

type ParamsSignup = {
  username: string;
  password: string;
  shownName: string;
};

type ParamsLogin = {
  username: string;
  password: string;
};

type ResultLogin = {
  user: User;
  token: string;
};

export class AuthService {
  public static async signup({ username, password, shownName }: ParamsSignup): Promise<User> {
    Logger.info(`New user **${username}** registered`);

    return UserService.create(
      {
        username,
        password,
        shownName,
      }
    );
  }

  public static async login({ username, password }: ParamsLogin): Promise<ResultLogin> {
    const user = await UserService.getUser({
      user: { username },
    });

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect)
      throw HttpResponseError.createWrongPasswordError();

    return {
      user,
      token: AuthService.token(user),
    };
  }

  public static token(
    user: User,
    unlimited?: boolean,
    options?: Partial<SessionTokenPayload>,
  ): string {
    return jws.sign({ UUID: user?.id, ...options }, AppConfig.config.app.auth.secretToken, {
      ...(!unlimited ? { expiresIn: AppConfig.config.app.auth.expiration } : {}),
    });
  }
}
