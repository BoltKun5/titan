import { LogType } from 'abyss_crypt_core';
import express from 'express';
import AppConfig from './modules/AppConfig';
import Logger from './modules/Logger';

export async function startServer(): Promise<void> {
  const app = express();
  var https = require('https');
  const fs = require("fs");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppConfig.sequelize = await require('./loaders').default(app);

  const httpsServer = https.createServer({
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
  }, app)

  const server = httpsServer
    .listen(AppConfig.config.app.port, () => {
      Logger.info(
        `

          ###############################################
          #     Server listening on port: ${AppConfig.config.app.port}     #
          ###############################################
        `,
        LogType.SYSTEM_STARTUP,
      );
    })
    .on('error', (err) => {
      Logger.error(err, LogType.SYSTEM_STARTUP);
      process.exit(1);
    });
  server.timeout = 1000000;
}
