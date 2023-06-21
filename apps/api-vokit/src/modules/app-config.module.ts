import * as config from '../config/index';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from 'abyss_monitor_core';

export default class AppConfig {
  public static process = {
    start: new Date(),
    sequelizeReady: false,
    env: (process.env.NODE_ENV || '').toLowerCase(),
  };

  public static sequelize: Sequelize;
  public static config = config.default;

  public static logger: Logger;

  public static init(): void {
    AppConfig.logger = new Logger({
      shouldDisableRemoteLogging: this.process.env === 'development',
      shouldDisableConsoleResponseBodyLogging: true,
    });
  }
}
