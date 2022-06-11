import expressLoader from './express';
import postgresLoader from './postgres';
import express from 'express';
import Logger from '../modules/Logger';
import { Sequelize } from 'sequelize/types';
import { LogType } from 'abyss_crypt_core';

export default async (expressApp: express.Application): Promise<Sequelize> => {
  const postgressConnection = await postgresLoader();
  Logger.info('DB loaded and connected!', LogType.SYSTEM_STARTUP);

  expressLoader({ app: expressApp });
  Logger.info('Express loaded', LogType.SYSTEM_STARTUP);

  Logger.info('All Dependency Injector loaded', LogType.SYSTEM_STARTUP);

  return postgressConnection;
};
