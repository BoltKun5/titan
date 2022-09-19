import bcrypt from 'bcryptjs';
import { IUser, handleError } from "abyss_core";
import { WhereOptions } from "sequelize";
import { User } from "../../src/database";
import { IncludeOptionsCustom } from "../../src/database/custom/CustomModel";
import { DefaultService } from "./models/DefaultService";

interface ParamsCreate {
  username: string;
  password: string;
  shownName: string;
}

export interface ParamsGetUser {
  user: User | WhereOptions<IUser>;
}

export class UserService extends DefaultService {

  // public static async getUser(
  //   params: ParamsGetUser,
  //   include?: IncludeOptionsCustom[],
  // ): Promise<User> {
  //   return UserService._fetch<User>(User, { model: params.user }, include);
  // }

  public static async create(params: ParamsCreate): Promise<User> {
    try {
      const { username, password, shownName } = params;
      const hash = bcrypt.hashSync(password, 12);

      const user = await User.create(
        {
          username,
          password: hash,
          shownName: shownName,
          role: 0
        }
      );
      return user;
    } catch (error) {
      throw handleError(error);
    }
  }
}
