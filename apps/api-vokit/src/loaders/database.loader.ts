import { Sequelize } from 'sequelize-typescript';
import AppConfig from '../modules/app-config.module';
import LoggerModule from '../modules/logger.module';
import { exec } from 'child_process';
import { readdirSync } from 'fs-extra';
import path from 'path';
import { requireModules } from '../utils/import.utils';
import { LogType } from 'vokit_core';

export default async (): Promise<Sequelize> => {
  const database = AppConfig.config.database;

  return new Promise(async (resolve) => {
    try {
      const connection = new Sequelize(database.database, database.username, database.password, {
        host: database.host,
        password: database.password,
        port: database.port,
        dialect: database.dialect,
        models: requireModules(path.join(__dirname, '../database/models')),
        logging: false,
        logQueryParameters: true,
        pool: {
          max: 10,
          min: 0,
          idle: 10000,
          acquire: 30000,
        },
      });
      await connection.authenticate();

      await connection.sync({ alter: true, force: false });

      await Promise.all([
        connection.query('CREATE TABLE IF NOT EXISTS "SequelizeData" (name VARCHAR(255));'),
        connection.query('CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255));'),
      ]);

      AppConfig.sequelize = connection;

      // await customMigrations(connection);
      // await customSeeders(connection);

      AppConfig.process.sequelizeReady = true;

      resolve(connection);
    } catch (error: any) {
      LoggerModule.error(error, { type: LogType.SYSTEM_STARTUP });
    }
  });
};

export const customSeeders = async (sequelize: Sequelize, down?: boolean): Promise<void> => {
  try {
    LoggerModule.log('-----------------------');
    LoggerModule.log('seeders sync...');
    const files = readdirSync(`${process.cwd()}/src/database/seeders`);

    const seeders = (
      (await sequelize.query('SELECT * FROM "SequelizeData";')) as { name: string }[][]
    )[0].map((seed) => seed.name);

    for (const file of files.filter((s) => !seeders.includes(s))) {
      const seederName = file.split('.')[0];
      const seed = await require(`./../database/seeders/${seederName}`);
      try {
        LoggerModule.log(`Running seeder **${seederName}**`);
        await (down ? seed.down : seed.up)(sequelize.getQueryInterface());
        await sequelize.query(`INSERT INTO "SequelizeData" (name) VALUES ('${file.toString()}');`);
      } catch (error: any) {
        console.error(error);
        await (!down ? seed.down : seed.up)(sequelize.getQueryInterface());
        throw error;
      }
    }

    await LoggerModule.log('Seeders synchronized');
  } catch (error: any) {
    await LoggerModule.error(new Error(`>>>LOG:error SEEDERS ${error}`));
    throw error;
  }
};

export const customMigrations = async (sequelize: Sequelize, down?: boolean): Promise<void> => {
  try {
    LoggerModule.log('-----------------------');
    LoggerModule.log('migrations sync...');
    const files = readdirSync(`${process.cwd()}/src/database/migrations`);

    const migrations = (
      (await sequelize.query('SELECT * FROM "SequelizeMeta";')) as { name: string }[][]
    )[0].map((migration) => migration.name);

    for (const file of files.filter((s) => !migrations.includes(s))) {
      const migrationName = file.split('.')[0];
      const migration = await require(`./../database/migrations/${migrationName}`);

      try {
        LoggerModule.log(`Running migrations **${migrationName}**`);
        await (down ? migration.down : migration.up)(sequelize.getQueryInterface());
        await sequelize.query(`INSERT INTO "SequelizeMeta" (name) VALUES ('${file.toString()}');`);
      } catch (error: any) {
        console.error(error);
        await (!down ? migration.down : migration.up)(sequelize.getQueryInterface());
        throw error;
      }
    }

    await LoggerModule.log('Migrations synchronized');
  } catch (error: any) {
    await LoggerModule.error(new Error(`>>>LOG:error MIGRATIONS ${error}`));
    throw error;
  }
};

export const cleanDatabases = (): Promise<void> =>
  new Promise((resolve) =>
    exec('sequelize db:drop', (_dbErr, _, _stderr) => {
      resolve();
    }),
  );
export const createDatabases = (): Promise<void> =>
  new Promise((resolve) =>
    exec('sequelize db:create', (_dbErr, _, _stderr) => {
      resolve();
    }),
  );
