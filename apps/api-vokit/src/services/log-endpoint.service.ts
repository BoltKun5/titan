import { WhereOptions } from 'sequelize/types';
import { LogEndpoint } from '../database';
import { IncludeOptionsWithModel } from '../database/custom/custom-model.model';
import { EntityService } from '../core/types/abstract/service.abstract';
import { Paginator } from '../core';
import { APIMethod, BasePaginate, ILogEndpoint, QueryPaginate } from 'vokit_core';

export type ParamsCreateLogEndpoint = {
  requestId: string;
  controller: string;
  endpoint: string;
  httpResultCode: number;
  processId: number;
  ips: string[];
  durationInMs: number;
  method: APIMethod;
  logConsoleId: string;
  requestParams: Record<string, unknown>;
  requestQuery: Record<string, unknown>;
  requestBody: Record<string, unknown>;
  responseBody: Record<string, unknown>;
  dateValue: Date;
};

export type ParamsGetLogEndpoint = {
  logEndpoint: LogEndpoint | WhereOptions<ILogEndpoint>;
};

type ParamsPaginate = {
  controller?: string;
  endpoint?: string;
  httpResultCode?: number;
  processId?: number[];
} & QueryPaginate;

class LogEndpointService extends EntityService<LogEndpoint, ILogEndpoint> {
  private readonly paginator = new Paginator(LogEndpoint);

  public async getLogEndpoint(
    params: ParamsGetLogEndpoint,
    include?: IncludeOptionsWithModel[],
  ): Promise<LogEndpoint> {
    return this._fetch(LogEndpoint, { model: params.logEndpoint }, include);
  }

  public async create(params: ParamsCreateLogEndpoint): Promise<LogEndpoint> {
    return LogEndpoint.create({ ...params });
  }

  public async paginate(params: ParamsPaginate): Promise<BasePaginate<LogEndpoint>> {
    const { controller, endpoint, httpResultCode, processId, ...baseParams } = params;

    return this.paginator.paginate({
      where: {
        ...(controller ? { controller } : {}),
        ...(endpoint ? { endpoint } : {}),
        ...(httpResultCode ? { httpResultCode } : {}),
        ...(processId ? { processId } : {}),
      },
      order: [['dateValue', 'DESC']],
      ...baseParams,
    });
  }
}

export default new LogEndpointService();
