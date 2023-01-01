import winston from 'winston';
import appRoot from 'app-root-path';
import chalk from 'chalk';
import AppConfig from './app-config.module';
import { LogConsole, LogEndpoint, User } from '../database';
import DiscordWebhook from '../services/discord-webhook.service';
import { dateFormatted } from '../utils/date.utils';
import logConsoleService from '../services/log-console.service';
import discordWebhookService from '../services/discord-webhook.service';
import { nonBlockingPromise } from '../utils/non-blocking-promise.utils';
import { chunk } from 'lodash';
import { APIMethod, LogType, LogLevel } from 'vokit_core';
import {
  DISCORD_EMBED_COLORS,
  generateDiscordApiLogMessageContent,
} from '../utils/discord-webhook-log-formatter.utils';

const MAX_EMBED_DESCRIPTION_LENGTH = 2048;

interface ParamsAPI {
  requestId: string;
  user: User | null;
  controller: string;
  endpoint: string;
  method: APIMethod;
  httpResultCode: number;
  requestIps: string[];
  durationInMs: number;
  requestStartDate: Date;
  requestParams?: Record<string, unknown>;
  requestQuery?: Record<string, unknown>;
  requestBody?: Record<string, unknown>;
  responseBody?: Record<string, unknown>;
  isAdmin?: boolean;
}

type ParamsLog = {
  requestId: string;
  context: string;
  type: LogType;
};

type ParamsInfo = {
  requestId: string;
  context: string;
  type: LogType;
  shouldLogIntoDiscord: boolean;
};

type ParamsWarn = ParamsInfo;
type ParamsError = Omit<ParamsInfo, 'shouldLogIntoDiscord'>;

const INFO_LEVEL = {
  ERROR: chalk.red('ERROR'),
  WARN: chalk.bgYellow.black('WARN'),
  INFO: chalk.blueBright('INFO'),
  HTTP: chalk.green('HTTP'),
  VERBOSE: chalk.grey('VERBOSE'),
  DEBUG: chalk.grey('DEBUG'),
  SILLY: chalk.cyan('SILLY'),
};

export default class LoggerModule {
  private static logConsole = winston.createLogger({
    transports: [
      // Note(Mehdi): The raw log on file
      new winston.transports.File({
        level: 'debug',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 5,
        format: winston.format.json(),
      }),
      // Note(Mehdi): The explicit console log containing essentials data
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.printf((info) => {
            const message = `${chalk.grey(dateFormatted())} | ${
              INFO_LEVEL[info.level.toUpperCase() as keyof typeof INFO_LEVEL]
            } | ${process.pid}${info.context ? ` | ${info.context}` : ''} | ${
              info.message || info.content || info.error.stack
            } `;

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
          const data = { ...info } as unknown as ParamsAPI;

          // Note(Mehdi): Deleting verbose data
          delete data.requestParams;
          delete data.requestQuery;
          delete data.requestBody;
          delete data.responseBody;

          return JSON.stringify({
            ...data,
            // Note(Mehdi): If data contain a user, we replace it by the userId
            ...(data.user ? { user: data.user.id } : {}),
          });
        }),
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.printf((info) => {
            let message = `${chalk.grey(dateFormatted())} | ${chalk.bgBlueBright(' API ')} | `;

            const data = info as unknown as ParamsAPI;
            message += `${chalk.grey(data.requestId)} | ${chalk.greenBright(
              APIMethod[data.method],
            )} | ${data.controller} ${data.endpoint} | `;

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

            if (data.durationInMs < 50)
              message += ` | ${chalk.greenBright(data.durationInMs, 'ms')}  | `;
            else if (data.durationInMs < 150)
              message += ` | ${chalk.yellow(data.durationInMs, 'ms')} | `;
            else message += ` | ${chalk.red(data.durationInMs, 'ms')} | `;

            message += `${data.requestIps.join(' ')} | `;

            if (data.httpResultCode < 200 || data.httpResultCode > 399)
              message += `${JSON.stringify(data.responseBody)}`;

            return message;
          }),
        ),
      }),
    ],
    exitOnError: false,
  });

  /**
   * Will log message on console, log file and database as LogConsole to help debugging and track request
   *
   * @param message
   * @param type
   * @returns
   */
  public static async log(
    message: string,
    options: Partial<ParamsLog> = {},
  ): Promise<LogConsole | void> {
    const { context = 'No Context', requestId = 'No Request Id', type = LogType.OTHER } = options;
    LoggerModule.logConsole.log('debug', {
      requestId,
      context,
      content: message,
      type,
      date: new Date(),
    });

    if (AppConfig.process.sequelizeReady) {
      return await logConsoleService.create({
        level: LogLevel.DEBUG,
        message: message,
        context,
        requestId,
      });
    }
  }

  public static async error(
    errorOrMessage: Error | string,
    options: Partial<ParamsError> = {},
  ): Promise<LogConsole | void> {
    const { context = 'No Context', requestId = 'No Request Id', type = LogType.OTHER } = options;

    const error = errorOrMessage instanceof Error ? errorOrMessage : new Error(errorOrMessage);

    LoggerModule.logConsole.log('error', { error, context, requestId, type, date: new Date() });

    nonBlockingPromise(
      discordWebhookService.createErrorMessage({
        embeds: [
          {
            color: DISCORD_EMBED_COLORS.red,
            author: {
              name: 'AbyssStorage - Error',
            },
            title: `[${options.context}] ${LogType[type]} - ${error.name}`,
            description: `${error.message} ${error.stack}`,
            footer: {
              text: `${dateFormatted()} - ${process.pid} - ${requestId}`,
            },
          },
        ],
      }),
    );

    if (AppConfig.process.sequelizeReady) {
      return await logConsoleService.create({
        level: LogLevel.ERROR,
        message: error.message,
        requestId: requestId,
        context: context,
        stack: error.stack,
      });
    }
  }

  /**
   * Will log the message on console, log file and database as LogConsole.
   * Optionally log into Discord Webhook
   *
   * @param message
   * @param options
   * @returns
   */
  public static async info(
    message: string,
    options: Partial<ParamsInfo> = {},
  ): Promise<LogConsole | void> {
    const {
      context = 'No Context',
      requestId = 'No Request Id',
      type = LogType.OTHER,
      shouldLogIntoDiscord = true,
    } = options;

    LoggerModule.logConsole.log('info', { message, context, requestId, type, date: new Date() });

    if (shouldLogIntoDiscord) {
      nonBlockingPromise(LoggerModule.infoDiscord(message, { context, requestId, type }));
    }

    if (AppConfig.process.sequelizeReady) {
      return await logConsoleService.create({
        level: LogLevel.INFO,
        message,
        requestId,
        context,
        type,
      });
    }
  }

  /**
   * Will log the message into Discord Webhook
   *
   * @param message
   * @param options
   */
  public static async infoDiscord(
    message: string,
    options: Omit<ParamsInfo, 'shouldLogIntoDiscord'>,
  ): Promise<void> {
    DiscordWebhook.createInfoMessage({
      embeds: [
        {
          color: DISCORD_EMBED_COLORS.blue,
          author: {
            name: `AbyssStorage - Info`,
          },
          title: `[${options.context}] ${LogType[options.type]}`,
          description: `${chunk(message, MAX_EMBED_DESCRIPTION_LENGTH)[0].join('')}`,
          footer: {
            text: `${dateFormatted()} - ${process.pid} - ${options.requestId}`,
          },
        },
      ],
    });
  }

  /**
   * Will log the message on console, log file and database as LogConsole.
   * Optionally log into Discord Webhook
   *
   * @param message
   * @param options
   * @returns
   */
  public static async warn(
    message: string,
    options: Partial<ParamsWarn> = {},
  ): Promise<LogConsole | void> {
    const {
      context = 'No Context',
      requestId = 'No Request Id',
      type = LogType.OTHER,
      shouldLogIntoDiscord = true,
    } = options;

    LoggerModule.logConsole.log('warn', {
      message,
      context,
      requestId,
      type,
      date: new Date(),
    });

    if (shouldLogIntoDiscord) {
      nonBlockingPromise(LoggerModule.warnDiscord(message, { context, requestId, type }));
    }

    if (AppConfig.process.sequelizeReady) {
      return await logConsoleService.create({
        level: LogLevel.WARN,
        message,
        requestId,
        context,
        type,
      });
    }
  }

  /**
   * Will log the message into Discord Webhook
   *
   * @param message
   * @param options
   * @returns
   */
  public static async warnDiscord(
    message: string,
    options: Omit<ParamsWarn, 'shouldLogIntoDiscord'>,
  ): Promise<void> {
    await DiscordWebhook.createInfoMessage({
      embeds: [
        {
          color: DISCORD_EMBED_COLORS.orange,
          author: {
            name: 'AbyssStorage - Warn',
          },
          title: `[${options.context}] ${LogType[options.type]}`,
          description: `${chunk(message, MAX_EMBED_DESCRIPTION_LENGTH)[0]}`,
          footer: {
            text: `${dateFormatted()} - ${process.pid} - ${options.requestId}`,
          },
        },
      ],
    });
  }

  /**
   * Will log the API Request on console, log file, Discord Webhook and database as LogConsole+LogEndpoint
   *
   * @param level
   * @param params
   * @returns
   */
  public static async logApiRequest(
    level: LogLevel,
    params: ParamsAPI,
  ): Promise<LogConsole | void> {
    LoggerModule.logEndpoint.log(LogLevel[level].toLocaleLowerCase(), {
      ...params,
      date: new Date(),
    });

    nonBlockingPromise(
      DiscordWebhook.createApiMessage(
        generateDiscordApiLogMessageContent({
          name: 'AbyssStorage',
          authenticatedUserOrMethod: params.isAdmin
            ? 'Authenticated By Admin Token'
            : params.user?.shownName || 'Not Authenticated',
          controller: params.controller,
          endpoint: params.endpoint,
          requestId: params.requestId,
          processId: process.pid.toString(),
          httpResultCode: params.httpResultCode,
          method: params.method,
          requestIps: params.requestIps,
          durationInMs: params.durationInMs,
          requestStartDate: params.requestStartDate,
          responseBody: params.responseBody,
        }),
      ),
    );

    if (AppConfig.process.sequelizeReady) {
      const logConsole = await logConsoleService.create(
        {
          level,
          message: '',
          context: params.controller,
          requestId: params.requestId,
          type: LogType.API,
          logEndpoint: {
            logConsoleId: '',
            ...params,
            requestQuery: params.requestQuery || {},
            requestParams: params.requestParams || {},
            requestBody: params.requestBody || {},
            responseBody: params.responseBody || {},
            dateValue: params.requestStartDate,
            durationInMs: params.durationInMs,
            method: params.method,
            ips: params.requestIps,
            processId: process.pid,
          },
        },
        { include: [LogEndpoint] },
      );

      return logConsole;
    }
  }
}
