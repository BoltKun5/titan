import express from 'express';
import AppConfig from './modules/app-config';
import Logger from './modules/logger';
import https from 'https';
import fs from 'fs';

export async function startServer(): Promise<void> {
  const app = express();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppConfig.sequelize = await require('./loaders').default(app);

  const httpsServer = https.createServer(
    {
      key: fs.readFileSync('privkey.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app,
  );

  const server = httpsServer
    .listen(AppConfig.config.app.port, () => {
      Logger.info(
        `

          ###############################################
          #     Server listening on port: ${AppConfig.config.app.port}     #
          ###############################################
        `,
      );
    })
    .on('error', (err: any) => {
      Logger.error(err);
      process.exit(1);
    });
  server.timeout = 1000000;
}
