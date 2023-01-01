import { CreateOptions, WhereOptions } from 'sequelize/types';
import { LogConsole, LogEndpoint } from '../database';
import { IncludeOptionsWithModel } from '../database/custom/custom-model.model';
import { EntityService } from '../core/types/abstract/service.abstract';
import { ParamsCreateLogEndpoint } from './log-endpoint.service';
import { LogLevel, LogType, ILogConsole, QueryPaginate, BasePaginate } from 'vokit_core';
import { Paginator } from '../core';

interface ParamsCreate {
  level: LogLevel;
  message: string;
  context?: string;
  requestId?: string;
  type?: LogType;
  stack?: string;
  dateValue?: Date;
  logEndpoint?: ParamsCreateLogEndpoint;
}

export type ParamsGetLogConsole = {
  logConsole: LogConsole | WhereOptions<ILogConsole>;
};

type ParamsPaginate = {
  level?: LogLevel;
  type?: LogType;
  requestId?: string;
  processId?: number[];
} & QueryPaginate;

class LogConsoleService extends EntityService<LogConsole, ILogConsole> {
  private readonly paginator = new Paginator(LogConsole);

  public async getLogConsole(
    params: ParamsGetLogConsole,
    include?: IncludeOptionsWithModel[],
  ): Promise<LogConsole> {
    return this._fetch(LogConsole, { model: params.logConsole }, include);
  }

  public async create(
    params: ParamsCreate,
    options?: CreateOptions<ILogConsole>,
  ): Promise<LogConsole> {
    return LogConsole.create(
      {
        ...params,
        level: params.level,
        message: params.message,
        processId: process.pid,
        ...(params.logEndpoint
          ? {
              logEndpoint: {
                ...params.logEndpoint,
                processId: process.pid,
              },
            }
          : {}),
      },
      { ...options },
    );
  }

  public async paginate(params: ParamsPaginate): Promise<BasePaginate<LogConsole>> {
    const { level, type, processId, requestId, ...baseParams } = params;

    return this.paginator.paginate({
      where: {
        ...(level ? { level } : {}),
        ...(type ? { type } : {}),
        ...(processId ? { processId } : {}),
        ...(requestId ? { requestId } : {}),
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

export default new LogConsoleService();
