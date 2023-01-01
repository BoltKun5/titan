import expressLoader from './express';
import postgresLoader from './postgres';
import express from 'express';
import Logger from '../modules/logger';
import { Sequelize } from 'sequelize/types';

export default async (expressApp: express.Application): Promise<Sequelize> => {
  const postgressConnection = await postgresLoader();
  Logger.info('DB loaded and connected!');

  expressLoader({ app: expressApp });
  Logger.info('Express loaded');

  Logger.info('All Dependency Injector loaded');

  return postgressConnection;
};
