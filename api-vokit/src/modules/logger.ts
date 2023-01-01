import winston from 'winston';
import appRoot from 'app-root-path';
import chalk from 'chalk';
import { User } from '../database';
import { APIMethod, LogLevel } from 'abyss_core';
import { dateFormatted } from '../utils/date.utils';
import { IResponse } from '../../../local-core/interface';
import { ServiceException } from '../utils/error.utils';

interface ParamsAPI {
  user: User | null;
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
  isAdmin?: boolean;
}

const INFO_LEVEL = {
  ERROR: chalk.red('ERROR'),
  WARN: chalk.bgYellow.black('WARN'),
  INFO: chalk.blueBright('INFO'),
  HTTP: chalk.green('HTTP'),
  VERBOSE: chalk.grey('VERBOSE'),
  DEBUG: chalk.grey('DEBUG'),
  SILLY: chalk.cyan('SILLY'),
};

export default class Logger {
  private static logConsole = winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'debug',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 5,
        format: winston.format.printf((info) => {
          let message = `${new Date().toUTCString()} | ${info.level.toUpperCase()} | `;

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
            const message = `${chalk.grey(dateFormatted())} | ${
              INFO_LEVEL[info.level.toUpperCase() as keyof typeof INFO_LEVEL]
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
          let message = `${new Date().toUTCString()} | ${info.level.toUpperCase()} | `;

          if (typeof info === 'object') {
            const data = info as unknown as ParamsAPI;

            message += `${APIMethod[data.method]} | ${data.endpoint} | ${data.httpResultCode} | ${
              data.durationMs
            } ms | ${data.ipRequest} | ${
              data.requestParams ? JSON.stringify(data.requestParams) : ''
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
            let message = `${chalk.grey(dateFormatted())} | ${
              INFO_LEVEL[info.level.toUpperCase() as keyof typeof INFO_LEVEL]
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

  public static async console(level: LogLevel, message: string): Promise<void> {
    Logger.logConsole.log(LogLevel[level].toLocaleLowerCase(), message);
  }

  public static async error(error: Error): Promise<void> {
    let localError: Error;

    if (typeof error === 'string') localError = new Error(error);
    else localError = error;

    if (error instanceof ServiceException)
      Logger.logConsole.log(
        'error',
        `${localError.message || 'no message'} (${(localError as ServiceException).getCode()}) - ${
          localError.stack
        }`,
      );
    else Logger.logConsole.log('error', `${localError.stack}`);
  }

  public static async info(message: string): Promise<void> {
    Logger.logConsole.log('info', message);
  }

  public static async warn(message: string): Promise<void> {
    Logger.logConsole.log('warn', message);
  }

  public static async api(level: LogLevel, params: ParamsAPI): Promise<void> {
    Logger.logEndpoint.log(LogLevel[level].toLocaleLowerCase(), {
      ...params,
    });
  }
}
