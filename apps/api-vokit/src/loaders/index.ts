import { LogScenario } from 'abyss_monitor_core';
import AppConfig from '../modules/app-config.module';
import { apiLoader } from './api.loader';
import { databaseLoader } from './database.loader';
import { Sequelize } from 'sequelize-typescript';

export const appLoader = async (): Promise<Sequelize> => {
  const connection = await databaseLoader();
  AppConfig.logger.log('DB loaded and connected!', { scenario: LogScenario.SYSTEM_STARTUP });

  apiLoader();
  AppConfig.logger.log('Express loaded', { scenario: LogScenario.SYSTEM_STARTUP });

  AppConfig.logger.log('All Dependency Injector loaded', { scenario: LogScenario.SYSTEM_STARTUP });

  return connection;
};
