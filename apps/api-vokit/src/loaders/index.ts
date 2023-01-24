import expressLoader from './api.loader';
import postgresLoader from './database.loader';
import LoggerModule from '../modules/logger.module';
import { Sequelize } from 'sequelize/types';
import { LogType } from 'vokit_core';

export default async (): Promise<Sequelize> => {
  const postgressConnection = await postgresLoader();
  LoggerModule.log('DB loaded and connected!', { type: LogType.SYSTEM_STARTUP });

  expressLoader();
  LoggerModule.log('Express loaded', { type: LogType.SYSTEM_STARTUP });

  LoggerModule.log('All Dependency Injector loaded', { type: LogType.SYSTEM_STARTUP });

  return postgressConnection;
};
