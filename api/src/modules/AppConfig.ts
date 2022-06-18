/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prefer-rest-params */
import * as config from '../config/index';
import { Sequelize } from 'sequelize-typescript';
import chalk from 'chalk';
import dayjs from 'dayjs';

export default class AppConfig {
  public static process = {
    start: new Date(),
    sequelizeReady: false,
    env: process.env.NODE_ENV?.toLowerCase(),
    isDev: process.env.NODE_ENV?.toLowerCase() === 'development' ? true : false,
  };

  public static sequelize: Sequelize;
  public static config = config.default;

  static consoleSetup(): void {
    Error.stackTraceLimit = AppConfig.config.app.stackTraceLimit;

    const promptConfig = AppConfig.config.logger.prompt;

    const log = console.log;
    console.log = function () {
      log.apply(
        console,
        [`${dayjs().format(promptConfig.dateFormat)} ${promptConfig.prompt.log}>`].concat(
          [].slice.call(arguments),
        ),
      );
    };

    const error = console.error;
    console.error = function () {
      error.apply(
        console,
        [
          `${dayjs().format(promptConfig.dateFormat)} ${chalk.red(promptConfig.prompt.error)}>`,
        ].concat([].slice.call(arguments)),
      );
    };

    const info = console.info;
    console.info = function () {
      info.apply(
        console,
        [
          `${dayjs().format(promptConfig.dateFormat)} ${chalk.green(promptConfig.prompt.info)}>`,
        ].concat([].slice.call(arguments)),
      );
    };

    const warn = console.warn;
    console.warn = function () {
      warn.apply(
        console,
        [
          `${dayjs().format(promptConfig.dateFormat)} ${chalk.yellowBright(
            promptConfig.prompt.warn,
          )}>`,
        ].concat([].slice.call(arguments)),
      );
    };
  }
}
