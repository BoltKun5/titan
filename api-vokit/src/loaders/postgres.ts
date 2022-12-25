import { Sequelize } from 'sequelize-typescript';
import AppConfig from '../modules/app-config';
import Logger from '../modules/logger';
import { readdirSync } from 'fs-extra';
import path from 'path';
import { requireModules } from '../utils/import.utils';
// import { UserCardPossession } from '../database/models/user-card-possession';
// import { CardPossessionHistoric } from '../database/models/card-possession-historic';

export default async (): Promise<Sequelize> => {
  const { database } = AppConfig.config;

  return new Promise(async (resolve) => {
    const connection = new Sequelize(database.database, database.username, database.password, {
      ...database.options,
      host: database.host,
      port: database.port,
      dialect: 'postgres',
      models: requireModules(path.join(__dirname, '../database/models')),
    });
    await connection.authenticate();

    // const createUserCardHistoric = (data: any, options: any = null) => {
    //   const { dataValues, _previousDataValues } = data;
    //   CardPossessionHistoric.create({
    //     cardPossessionId: dataValues.id,
    //     boosterId: options?.boosterId ?? null,
    //     oldClassicQuantity: _previousDataValues.classicQuantity ?? 0,
    //     newClassicQuantity: dataValues.classicQuantity ?? 0,
    //     oldReverseQuantity: _previousDataValues.reverseQuantity ?? 0,
    //     newReverseQuantity: dataValues.reverseQuantity ?? 0,
    //   });
    // };

    // UserCardPossession.afterBulkCreate(createUserCardHistoric);
    // UserCardPossession.afterBulkUpdate(createUserCardHistoric);
    // UserCardPossession.afterCreate(createUserCardHistoric);
    // UserCardPossession.afterUpdate(createUserCardHistoric);

    await connection.sync({ alter: true });

    if (process.env.NEW_SETUP) {
      await connection.query('DROP SCHEMA IF EXISTS public CASCADE;');
      await connection.query('CREATE SCHEMA public;');

      await Promise.all([
        connection.query('CREATE TABLE IF NOT EXISTS public."SequelizeData" (name varchar(255));'),
        connection.query('CREATE TABLE IF NOT EXISTS public."SequelizeMeta" (name varchar(255));'),
      ]);
      await Promise.all([
        connection.query('DELETE FROM public."SequelizeData" WHERE true;'),
        connection.query('DELETE FROM public."SequelizeMeta" WHERE true;'),
      ]);
    }

    AppConfig.sequelize = connection;

    // await customMigrations(connection);
    // await customSeeders(connection);

    AppConfig.process.sequelizeReady = true;

    resolve(connection);
  });
};

export const customSeeders = async (sequelize: Sequelize, down?: boolean): Promise<void> => {
  try {
    Logger.info('-----------------------');
    Logger.info('seeders sync...');
    const files = readdirSync(`${process.cwd()}/src/database/seeders`);

    const seeders = (await sequelize.query('SELECT * FROM public."SequelizeData";'))[0].map(
      (seed: any) => seed.name,
    );

    for (const file of files.filter((s) => !seeders.includes(s))) {
      const seed = await require(`./../database/seeders/${file.split('.')[0]}`);
      await (down ? seed.down : seed.up)(sequelize.getQueryInterface());
      await sequelize.query(
        `INSERT INTO public."SequelizeData" (name) VALUES ('${file.toString()}');`,
      );
    }

    await Logger.info('synchronized seeders');
  } catch (error) {
    await Logger.error(new Error(`>>>LOG:error SEEDERS ${error}`));
  }
};

export const customMigrations = async (sequelize: Sequelize, down?: boolean): Promise<void> => {
  try {
    Logger.info('-----------------------');
    Logger.info('migrations sync...');
    const files = readdirSync(`${process.cwd()}/src/database/migrations`);

    const migrations = (await sequelize.query('SELECT * FROM public."SequelizeMeta";'))[0].map(
      (migration: any) => migration.name,
    );

    for (const file of files.filter((s) => !migrations.includes(s))) {
      const migration = await require(`./../database/migrations/${file.split('.')[0]}`);
      await (down ? migration.down : migration.up)(sequelize.getQueryInterface());
      await sequelize.query(
        `INSERT INTO public."SequelizeMeta" (name) VALUES ('${file.toString()}');`,
      );
    }

    await Logger.info('synchronized migrations');
  } catch (error) {
    await Logger.error(new Error(`>>>LOG:error MIGRATIONS ${error}`));
  }
};
