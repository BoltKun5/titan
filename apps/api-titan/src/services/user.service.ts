import bcrypt from 'bcryptjs';
import { FindOptions, WhereOptions } from 'sequelize';
import { BasePaginate, IUser, QueryPaginate } from 'titan_core';
import { User } from '../database';
import { EntityService, Paginator } from '../core';
import { IncludeOptionsWithModel } from '../database/custom/custom-model.model';

interface ParamsCreate {
  mail: string;
  password: string;
  firstName: string;
  lastName: string;
  shownName: string;
}

export interface ParamsGetUser {
  user: User | WhereOptions<IUser>;
}

type ParamsPaginate = {
  id?: string | string[];
} & QueryPaginate;

export class UserService extends EntityService<User, IUser> {
  private readonly paginator = new Paginator(User);

  public async getUser(
    params: ParamsGetUser,
    include?: IncludeOptionsWithModel[],
    options?: FindOptions,
  ): Promise<User> {
    return this._fetch(User, { model: params.user }, include, options);
  }

  public async paginate(params: ParamsPaginate): Promise<BasePaginate<User>> {
    const { id, ...baseParams } = params;

    return this.paginator.paginate({
      where: {
        ...(id ? { id } : {}),
      },
      order: [['createdAt', 'DESC']],
      ...baseParams,
    });
  }

  public async create(params: ParamsCreate): Promise<User> {
    try {
      const { mail, password, firstName, lastName, shownName } = params;
      const hash = bcrypt.hashSync(password, 12);

      this.logger.log(`User has been created with mail ${mail}`);

      const user = await User.create({
        mail,
        password: hash,
        firstName,
        lastName,
        shownName,
        role: 0,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
