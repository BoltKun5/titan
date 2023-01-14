import express, { Response, Request, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import routes from '../api';
import { ILocals } from '../core';
import AppConfig from '../modules/app-config.module';
import LoggerModule from '../modules/logger.module';
import { middleware as httpContextMiddleware } from 'express-http-context';
import endpointLoggerMiddleware from '../api/middlewares/endpoint-logger.middleware';
import generalSetupMiddleware from '../api/middlewares/general-setup.middleware';
import listEndpoints from 'express-list-endpoints';
import { HttpResponseError } from '../modules/http-response-error';
import { LogType } from 'vokit_core';
import https from 'https';
import { readFileSync } from 'fs-extra';
require('express-async-errors');

export default (): express.Application => {
  const app = express();

  app.use(httpContextMiddleware);

  app.disable('x-powered-by');

  app.use(generalSetupMiddleware);
  app.use(endpointLoggerMiddleware);

  app.use(cors());
  app.use((req: Request, res: Response<any, ILocals>, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Expose-Headers', 'Content-disposition, filename');
    next();
  });
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('helmet')());
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('compression')());

  app.use(AppConfig.config.api.prefix, routes());

  const endpoints = listEndpoints(app);
  const numberOfRoutes = endpoints.reduce((acc, endpoint) => acc + endpoint.methods.length, 0);
  LoggerModule.info(`${numberOfRoutes} Routes loaded !`, {
    type: LogType.API,
  });

  app.use(
    (
      error: Error | createError.HttpError,
      req: Request,
      res: Response<unknown, ILocals>,
      _next: NextFunction,
    ) => {
      LoggerModule.error(error, { type: LogType.API });
      HttpResponseError.sendError(error, req, res);
    },
  );

  const httpsServer = https.createServer(
    {
      key: readFileSync(__dirname + '/__fixtures__/privkey.pem'),
      cert: readFileSync(__dirname + '/__fixtures__/cert.pem'),
    },
    app,
  );

  httpsServer
    .listen(AppConfig.config.app.port, () => {
      LoggerModule.info(`Server listening on port: ${AppConfig.config.app.port}`, {
        type: LogType.SYSTEM_STARTUP,
      });
      LoggerModule.log(
        `
        ###############################################
        🛡️      Server listening on port: ${AppConfig.config.app.port}      🛡️
        ###############################################`,
        { type: LogType.SYSTEM_STARTUP },
      );
    })
    .on('error', (err) => {
      LoggerModule.error(err, { type: LogType.SYSTEM_STARTUP });
      process.exit(1);
    });

  return app;
};
