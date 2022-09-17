import winston from 'winston';
import appRoot from 'app-root-path';
import { LogConsoleService } from '../services/logConsole.service';
import chalk from 'chalk';
import AppConfig from './AppConfig';
import { LogConsole, LogEndpoint } from '../database';
import dayjs from 'dayjs';
import { ServiceException } from 'abyss_core';
import { APIMethod, LogLevel, LogType } from 'abyss_crypt_core';
import { IResponse } from '@local-core';

interface ParamsAPI {
  controller: string;
  endpoint: string;
  method: APIMethod;
  httpResultCode: number;
  ipRequest: string;
  durationMs: number;
  requestParams?: Record<string, unknown>;
  requestQuery?: Record<string, unknown>;
  requestBody?: Record<string, unknown>;
  responseBody?: IResponse<any>;
}

const infoLevel = {
  ERROR: chalk.red('ERROR'),
  WARN: chalk.bgYellow.black('WARN'),
  INFO: chalk.blueBright('INFO'),
  HTTP: chalk.green('HTTP'),
  VERBOSE: chalk.grey('VERBOSE'),
  DEBUG: chalk.grey('DEBUG'),
  SILLY: chalk.cyan('SILLY'),
};

interface Options {
  taskId?: string;
}

export default class Logger {
  private static dateFormatedConsole(): string {
    return dayjs().format(AppConfig.config.logger.prompt.dateFormat);
  }

  private static dateFormatedLog(): string {
    return new Date(Date.now()).toUTCString();
  }

  private static logConsole = winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'debug',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 5,
        format: winston.format.printf((info) => {
          let message = `${Logger.dateFormatedLog()} | ${info.level.toUpperCase()} | `;

          if (typeof info.message === 'object')
            message += `data:${JSON.stringify(info.message)} | `;
          else message += info.message;
          return message;
        }),
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.printf((info) => {
            const message = `${chalk.grey(Logger.dateFormatedConsole())} | ${infoLevel[info.level.toUpperCase()]
              } | ${info.message} `;

            return message;
          }),
        ),
      }),
    ],
    exitOnError: false,
  });

  private static logEndpoint = winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'debug',
        filename: `${appRoot}/logs/endpoint.log`,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 5,
        format: winston.format.printf((info) => {
          let message = `${Logger.dateFormatedLog()} | ${info.level.toUpperCase()} | `;

          if (typeof info === 'object') {
            const data = info as unknown as ParamsAPI;

            message += `${APIMethod[data.method]} | ${data.endpoint} | ${data.httpResultCode} | ${data.durationMs
              } ms | ${data.ipRequest} | ${data.requestParams ? JSON.stringify(data.requestParams) : ''
              } | ${data.requestQuery ? JSON.stringify(data.requestQuery) : ''} | `;

            message +=
              typeof data.requestBody === 'object'
                ? `${JSON.stringify(data.requestBody)} | `
                : ' | ';

            message +=
              typeof data.responseBody === 'object'
                ? `${JSON.stringify(data.responseBody)} |`
                : ' | ';
          }
          return message;
        }),
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.printf((info) => {
            let message = `${chalk.grey(Logger.dateFormatedConsole())} | ${infoLevel[info.level.toUpperCase()]
              } | `;

            if (typeof info === 'object') {
              const data = info as unknown as ParamsAPI;
              message += `${chalk.greenBright(APIMethod[data.method])} | ${data.endpoint} | `;

              if (data.httpResultCode >= 100 && data.httpResultCode <= 199)
                message += `${chalk.blue(data.httpResultCode)}`;
              else if (data.httpResultCode >= 200 && data.httpResultCode <= 299)
                message += `${chalk.green(data.httpResultCode)}`;
              else if (data.httpResultCode >= 300 && data.httpResultCode <= 399)
                message += `${chalk.magenta(data.httpResultCode)}`;
              else if (data.httpResultCode >= 400 && data.httpResultCode <= 499)
                message += `${chalk.yellow(data.httpResultCode)}`;
              else if (data.httpResultCode >= 500 && data.httpResultCode <= 599)
                message += `${chalk.red(data.httpResultCode)}`;
              else message += `${chalk.bgCyanBright.black(data.httpResultCode)}`;

              if (data.durationMs < 50)
                message += ` | ${chalk.greenBright(data.durationMs, 'ms')}  | `;
              else if (data.durationMs < 150)
                message += ` | ${chalk.yellow(data.durationMs, 'ms')} | `;
              else message += ` | ${chalk.red(data.durationMs, 'ms')} | `;

              message += `${data.ipRequest} | `;

              if (data.httpResultCode < 200 || data.httpResultCode > 399)
                message += `${JSON.stringify(data.responseBody)}`;
            }

            return message;
          }),
        ),
      }),
    ],
    exitOnError: false,
  });

  public static async error(
    error: Error,
    type: LogType = LogType.OTHER,
    options?: Options,
  ): Promise<LogConsole> {
    if (error instanceof ServiceException)
      Logger.logConsole.log(
        'error',
        `${error.message || 'no message'} (${(error as ServiceException).getCode()}) - ${error.stack
        }`,
      );
    else Logger.logConsole.log('error', `${error.message}`);

    if (AppConfig.process.sequelizeReady)
      return await LogConsoleService.create({
        level: LogLevel.ERROR,
        message: error.message,
        type,
        stack: error.stack,
        taskId: options?.taskId,
      });
  }

  public static async info(
    message: string,
    type: LogType = LogType.OTHER,
    options?: Options,
  ): Promise<LogConsole> {
    Logger.logConsole.log('info', message);

    if (AppConfig.process.sequelizeReady)
      return await LogConsoleService.create({
        level: LogLevel.INFO,
        message: message,
        type,
        taskId: options?.taskId,
      });
  }

  public static async warn(
    message: string,
    type: LogType = LogType.OTHER,
    options?: Options,
  ): Promise<LogConsole> {
    Logger.logConsole.log('warn', message);

    if (AppConfig.process.sequelizeReady)
      return await LogConsoleService.create({
        level: LogLevel.WARN,
        message: message,
        type,
        taskId: options?.taskId,
      });
  }

  public static async api(level: LogLevel, params: ParamsAPI): Promise<LogConsole> {
    Logger.logEndpoint.log(LogLevel[level].toLocaleLowerCase(), {
      ...params,
    });

    if (AppConfig.process.sequelizeReady) {
      const logConsole = await LogConsoleService.create(
        {
          level,
          message: '',
          type: LogType.API,
          logEndpoint: {
            logConsoleId: '',
            ...params,
            requestQuery: JSON.stringify(params.requestQuery),
            requestParams: JSON.stringify(params.requestParams),
            requestBody: JSON.stringify(params.requestBody),
            responseBody: JSON.stringify(params.responseBody),
            durationMs: params.durationMs,
            method: params.method,
            ip: params.ipRequest,
          },
        },
        { include: [...(level === 1 || level === 2) ? [LogEndpoint] : []] },
      );

      return logConsole;
    }
  }
}
