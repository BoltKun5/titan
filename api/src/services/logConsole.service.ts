import { CreateOptions, FindOptions, Transaction, WhereOptions } from 'sequelize/types';
import Paginator from '../modules/Utils/Paginator';
import { LogConsole, LogEndpoint } from '../database';
import { IncludeOptionsCustom } from '../database/custom/CustomModel';
import { DefaultService } from './models/DefaultService';
import { ParamsCreateLogEndpoint } from './logEndpoint.service';
import { QueryPaginate, BasePaginate } from 'abyss_core';
import { LogLevel, LogType, ILogConsole } from 'abyss_crypt_core';

interface ParamsCreate {
  level: LogLevel;
  message: string;
  type?: LogType;
  stack?: string;
  dateValue?: Date;
  taskId?: string;
  logEndpoint?: ParamsCreateLogEndpoint;
}

export type ParamsGetLogConsole = {
  logConsole: LogConsole | WhereOptions<ILogConsole>;
};

type ParamsUpdateLogConsole = {
  values: Partial<ILogConsole>;
} & ParamsGetLogConsole;

type ParamsPaginate = {
  level?: LogLevel;
  type?: LogType;
} & QueryPaginate;

export class LogConsoleService extends DefaultService {
  private static paginator = new Paginator(LogConsole);

  public static async getOne(params: FindOptions<ILogConsole>): Promise<LogConsole> {
    return LogConsole.findOne({ ...params });
  }

  public static async getAll(params: FindOptions<ILogConsole>): Promise<LogConsole[]> {
    return LogConsole.findAll({ ...params });
  }

  public static async update(
    params: ParamsUpdateLogConsole,
    transaction?: Transaction,
  ): Promise<LogConsole> {
    const logConsole = await LogConsoleService.getLogConsole({
      logConsole: params.logConsole,
    });
    return logConsole.update({ ...params.values }, { transaction });
  }

  // Custom

  public static async getLogConsole(
    params: ParamsGetLogConsole,
    include?: IncludeOptionsCustom[],
  ): Promise<LogConsole> {
    return LogConsoleService._fetch<LogConsole>(LogConsole, { model: params.logConsole }, include);
  }

  public static async create(
    params: ParamsCreate,
    options?: CreateOptions<ILogConsole>,
  ): Promise<LogConsole> {
    return LogConsole.create({ ...params }, { ...options });
  }

  public static async paginate(params: ParamsPaginate): Promise<BasePaginate<LogConsole>> {
    const { level, type, ...baseParams } = params;

    return LogConsoleService.paginator.paginate({
      where: {
        ...(level ? { level } : {}),
        ...(type ? { type } : {}),
      },
      order: [['dateValue', 'DESC']],
      ...baseParams,
      include: [
        {
          model: LogEndpoint,
          attributes: { exclude: ['requestParams', 'requestBody', 'requestQuery', 'responseBody'] },
        },
      ],
    });
  }
}
