import { CreateOptions, FindOptions, Transaction, WhereOptions } from 'sequelize/types';
import Paginator from '../modules/Utils/Paginator';
import { Cryption } from '../database';
import { IncludeOptionsCustom } from '../database/custom/CustomModel';
import { DefaultService } from './models/DefaultService';
import AbyssCore from 'abyss_core';
import { CryptionType, ICryption, Algorithm } from 'abyss_crypt_core';

interface ParamsCreate {
  type: CryptionType;
  algorithm: Algorithm;
  startDate?: Date;
}

export type ParamsGetCryption = {
  logConsole: Cryption | WhereOptions<ICryption>;
};

type ParamsUpdateCryption = {
  values: Partial<ICryption>;
} & ParamsGetCryption;

type ParamsPaginate = {
  algorithm?: Algorithm;
  type?: CryptionType;
} & AbyssCore.QueryPaginate;

export class CryptionService extends DefaultService {
  private static paginator = new Paginator(Cryption);

  public static async getOne(params: FindOptions<ICryption>): Promise<Cryption> {
    return Cryption.findOne({ ...params });
  }

  public static async getAll(params: FindOptions<ICryption>): Promise<Cryption[]> {
    return Cryption.findAll({ ...params });
  }

  public static async update(
    params: ParamsUpdateCryption,
    transaction?: Transaction,
  ): Promise<Cryption> {
    const logConsole = await CryptionService.getCryption({
      logConsole: params.logConsole,
    });
    return logConsole.update({ ...params.values }, { transaction });
  }

  // Custom

  public static async getCryption(
    params: ParamsGetCryption,
    include?: IncludeOptionsCustom[],
  ): Promise<Cryption> {
    return CryptionService._fetch<Cryption>(Cryption, { model: params.logConsole }, include);
  }

  public static async create(
    params: ParamsCreate,
    options?: CreateOptions<ICryption>,
  ): Promise<Cryption> {
    return Cryption.create({ ...params }, { ...options });
  }

  public static async paginate(params: ParamsPaginate): Promise<AbyssCore.BasePaginate<Cryption>> {
    const { algorithm, type, ...baseParams } = params;

    return CryptionService.paginator.paginate({
      where: {
        ...(algorithm ? { algorithm } : {}),
        ...(type ? { type } : {}),
      },
      order: [['dateValue', 'DESC']],
      ...baseParams,
    });
  }
}
