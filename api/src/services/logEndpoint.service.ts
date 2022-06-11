import { FindOptions, Transaction, WhereOptions } from 'sequelize/types';
import Paginator from '../modules/Utils/Paginator';
import { LogEndpoint } from '../database';
import { IncludeOptionsCustom } from '../database/custom/CustomModel';
import { DefaultService } from './models/DefaultService';
import AbyssCore from 'abyss_core';
import { ILogEndpoint } from 'abyss_crypt_core';

export type ParamsCreateLogEndpoint = {
  controller: string;
  endpoint: string;
  httpResultCode: number;
  ip: string;
  durationMs: number;
  method: AbyssCore.APIMethod;
  logConsoleId: string;
  requestParams?: string;
  requestQuery?: string;
  requestBody?: string;
  responseBody?: string;
  dateValue?: Date;
};

export type ParamsGetLogEndpoint = {
  logEndpoint: LogEndpoint | WhereOptions<ILogEndpoint>;
};

type ParamsUpdateLogEndpoint = {
  values: Partial<ILogEndpoint>;
} & ParamsGetLogEndpoint;

type ParamsPaginate = {
  controller: string;
  endpoint: string;
  httpResultCode: number;
} & AbyssCore.QueryPaginate;

export class LogEndpointService extends DefaultService {
  private static paginator = new Paginator(LogEndpoint);

  public static async getOne(params: FindOptions<ILogEndpoint>): Promise<LogEndpoint> {
    return LogEndpoint.findOne({ ...params });
  }

  public static async getAll(params: FindOptions<ILogEndpoint>): Promise<LogEndpoint[]> {
    return LogEndpoint.findAll({ ...params });
  }

  public static async update(
    params: ParamsUpdateLogEndpoint,
    transaction?: Transaction,
  ): Promise<LogEndpoint> {
    const logEndpoint = await LogEndpointService.getLogEndpoint({
      logEndpoint: params.logEndpoint,
    });
    return logEndpoint.update({ ...params.values }, { transaction });
  }

  // Custom

  public static async getLogEndpoint(
    params: ParamsGetLogEndpoint,
    include?: IncludeOptionsCustom[],
  ): Promise<LogEndpoint> {
    return LogEndpointService._fetch<LogEndpoint>(
      LogEndpoint,
      { model: params.logEndpoint },
      include,
    );
  }

  public static async create(params: ParamsCreateLogEndpoint): Promise<LogEndpoint> {
    return LogEndpoint.create({ ...params });
  }

  public static async paginate(
    params: ParamsPaginate,
  ): Promise<AbyssCore.BasePaginate<LogEndpoint>> {
    const { controller, endpoint, httpResultCode, ...baseParams } = params;

    return LogEndpointService.paginator.paginate({
      where: {
        ...(controller ? { controller } : {}),
        ...(endpoint ? { endpoint } : {}),
        ...(httpResultCode ? { httpResultCode } : {}),
      },
      order: [['dateValue', 'DESC']],
      ...baseParams,
    });
  }
}
