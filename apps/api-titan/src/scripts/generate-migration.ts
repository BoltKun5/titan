import { SequelizeTypescriptMigration } from 'sequelize-typescript-migration-lts';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { readdirSync } from 'fs-extra';
import betterLogging from 'better-logging';
import { extname, resolve } from 'path';
dotenv.config();

betterLogging(console);

export const requireModules = (name: string): any[] =>
  readdirSync(resolve(`${name}`))
    .filter((f) => ['.js', '.ts'].includes(extname(f)) && !/\.d\.ts/.exec(f))
    .map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const a = require(resolve(`${name}/${f}`));
      if (Object.entries(a).length) {
        return Object.entries(a)[0][1] as any;
      }
      return null;
    })
    .filter((e) => e !== null)
    .filter((e) => e);

(async () => {
  const sequelize = new Sequelize(
    process.env.DATABASE_NAME || '',
    process.env.DATABASE_USERNAME || '',
    process.env.DATABASE_PASSWORD || '',
    {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '0'),
      dialect: 'postgres',
      models: requireModules(join(__dirname, './../database/models')),
    },
  );

  await SequelizeTypescriptMigration.makeMigration(sequelize as any, {
    outDir: join(__dirname, './../database/migrations'),
    migrationName: 'migration',
    preview: false,
    debug: true,
  });

  console.warn('DO NOT FORGET TO CHECK MIGRATION');
  console.warn('PLEASE EDIT MIGRATION TO LINT AND REMOVE POS USAGE');

  process.exit();
})();
