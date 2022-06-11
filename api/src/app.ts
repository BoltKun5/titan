import { LogType } from 'abyss_crypt_core';
import express from 'express';
import AppConfig from './modules/AppConfig';
import Logger from './modules/Logger';

export async function startServer(): Promise<express.Application> {
  const app = express();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppConfig.sequelize = await require('./loaders').default(app);

  await Logger.info('Generating token apps...');

  app
    .listen(AppConfig.config.app.port, () => {
      Logger.info(
        `

          ###############################################
          🛡️      Server listening on port: ${AppConfig.config.app.port}      🛡️
          ###############################################
        `,
        LogType.SYSTEM_STARTUP,
      );
    })
    .on('error', (err) => {
      Logger.error(err, LogType.SYSTEM_STARTUP);
      process.exit(1);
    });

  return app;
}
