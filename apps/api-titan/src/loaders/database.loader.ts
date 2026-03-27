import { Sequelize } from 'sequelize-typescript';
import AppConfig from '../modules/app-config.module';
import { exec } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs-extra';
import path from 'path';
import { requireModules } from '../utils/import.utils';
import { LogScenario } from 'abyss_monitor_core';

export const databaseLoader = async (): Promise<Sequelize> => {
  const database = AppConfig.config.database;

  try {
    const connection = new Sequelize(
      database.database,
      database.username,
      database.password,
      {
        host: database.host,
        password: database.password,
        port: database.port,
        dialect: database.dialect,
        models: [
          ...requireModules(path.join(__dirname, '../database/models')),
          ...requireModules(path.join(__dirname, '../database/models/titan')),
        ],
        logging: false,
        logQueryParameters: false,
        pool: {
          max: 10,
          min: 0,
          idle: 10000,
          acquire: 30000,
        },
      },
    );
    await connection.authenticate();

    await connection.sync({ alter: true, force: true });

    await Promise.all([
      connection.query(
        'CREATE TABLE IF NOT EXISTS "SequelizeData" (name VARCHAR(255));',
      ),
      connection.query(
        'CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255));',
      ),
    ]);

    AppConfig.sequelize = connection;

    await customMigrations(connection);
    // await customSeeders(connection);

    AppConfig.process.sequelizeReady = true;

    return connection;
  } catch (error: any) {
    AppConfig.logger.error(error, { scenario: LogScenario.SYSTEM_STARTUP });
    throw error;
  }
};

export const customSeeders = async (sequelize: Sequelize): Promise<void> => {
  try {
    AppConfig.logger.log('Running seeders...', {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
    const seederPath = `${process.cwd()}/src/database/seeders`;

    existsSync(seederPath);
    if (!existsSync(seederPath)) {
      AppConfig.logger.log(
        `Creating seeder directory because directory do not exist...`,
        {
          scenario: LogScenario.SYSTEM_STARTUP,
        },
      );
      mkdirSync(seederPath);
    }
    const files = readdirSync(seederPath);

    const seeders = (
      (await sequelize.query('SELECT * FROM "SequelizeData";')) as {
        name: string;
      }[][]
    )[0].map((seed) => seed.name);

    for (const file of files.filter((s) => !seeders.includes(s))) {
      const seederName = file.split('.')[0];
      const seed = await require(`./../database/seeders/${seederName}`);
      try {
        AppConfig.logger.log(`Running seeder **${seederName}**`, {
          scenario: LogScenario.SYSTEM_STARTUP,
        });
        await seed.up(sequelize.getQueryInterface());
        await sequelize.query(
          'INSERT INTO "SequelizeData" (name) VALUES (?);',
          { replacements: [file.toString()] },
        );
      } catch (error: any) {
        console.error(error);
        await seed.down(sequelize.getQueryInterface());
        throw error;
      }
    }

    await AppConfig.logger.log('Seeders synchronized', {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
  } catch (error: any) {
    await AppConfig.logger.error(new Error(`>>>LOG:error SEEDERS ${error}`), {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
    throw error;
  }
};

export const customMigrations = async (sequelize: Sequelize): Promise<void> => {
  try {
    AppConfig.logger.log('Running migrations...', {
      scenario: LogScenario.SYSTEM_STARTUP,
    });

    const migrationPath = `${process.cwd()}/src/database/migrations`;
    existsSync(migrationPath);
    if (!existsSync(migrationPath)) {
      AppConfig.logger.log(
        `Creating migration directory because directory do not exist...`,
        {
          scenario: LogScenario.SYSTEM_STARTUP,
        },
      );
      mkdirSync(migrationPath);
    }
    const files = readdirSync(migrationPath);

    const migrations = (
      (await sequelize.query('SELECT * FROM "SequelizeMeta";')) as {
        name: string;
      }[][]
    )[0].map((migration) => migration.name);

    for (const file of files.filter((s) => !migrations.includes(s))) {
      const migrationName = file.split('.')[0];
      const migration =
        await require(`./../database/migrations/${migrationName}`);

      try {
        AppConfig.logger.log(`Running migrations **${migrationName}**`, {
          scenario: LogScenario.SYSTEM_STARTUP,
        });
        await migration.up(sequelize.getQueryInterface());
        await sequelize.query(
          'INSERT INTO "SequelizeMeta" (name) VALUES (?);',
          { replacements: [file.toString()] },
        );
      } catch (error: any) {
        console.error(error);
        await migration.down(sequelize.getQueryInterface());
        throw error;
      }
    }

    await AppConfig.logger.log('Migrations synchronized', {
      scenario: LogScenario.SYSTEM_STARTUP,
    });
  } catch (error: any) {
    await AppConfig.logger.error(
      new Error(`>>>LOG:error MIGRATIONS ${error}`),
      {
        scenario: LogScenario.SYSTEM_STARTUP,
      },
    );
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
