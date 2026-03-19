import express, { Response, Request, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import routes from '../api';
import { ILocals } from '../core';
import AppConfig from '../modules/app-config.module';
import listEndpoints from 'express-list-endpoints';
import {
  LogScenario,
  contextMiddleware,
  loggerEndpointMiddleware,
  loggerSetupMiddleware,
} from 'abyss_monitor_core';
import { HttpResponseError } from '../modules/http-response-error';
import 'express-async-errors';
import helmet from 'helmet';
import compression from 'compression';

const PREFIX = '/api';

export const apiLoader = (): express.Application => {
  const app = express();

  app.use(contextMiddleware);

  app.disable('x-powered-by');

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
  app.use(helmet());
  app.use(compression());

  app.get('/', (req, res, next) => {
    res.locals.shouldNotPublishLog = true;
    res.send();
    next();
  });

  app.use(loggerSetupMiddleware);
  app.use((req, res, next) => loggerEndpointMiddleware(AppConfig.logger, req, res as any, next));

  app.use(PREFIX, routes());

  const endpoints = listEndpoints(app);
  const numberOfRoutes = endpoints.reduce((acc, endpoint) => acc + endpoint.methods.length, 0);
  AppConfig.logger.log(`${numberOfRoutes} Routes loaded !`, {
    scenario: LogScenario.SYSTEM_STARTUP,
  });

  app.use(
    (
      error: Error | createError.HttpError,
      req: Request,
      res: Response<unknown, ILocals>,
      _next: NextFunction,
    ) => {
      console.log(error);
      HttpResponseError.sendError(error, req, res);
    },
  );

  app
    .listen(AppConfig.config.app.port, () => {
      AppConfig.logger.log(`API Server listening on port: ${AppConfig.config.app.port}`, {
        scenario: LogScenario.SYSTEM_STARTUP,
      });
    })
    .on('error', (err) => {
      AppConfig.logger.error(err, { scenario: LogScenario.SYSTEM_STARTUP });
      process.exit(1);
    });

  return app;
};
