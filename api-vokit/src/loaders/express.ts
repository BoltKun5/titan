import express, { Response, Request, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import routes from '../api';
import { HttpResponseError } from '../modules/http-response-error';
import AppConfig from '../modules/app-config';
import Logger from '../modules/logger';
import { getDurationInMilliseconds } from 'abyss_core';
import { APIMethod, LogLevel } from 'abyss_crypt_core';
import { IResponseLocals } from '../../../local-core';
require('express-async-errors');

export default ({ app }: { app: express.Application }): express.Application => {
  app.disable('x-powered-by');

  app.use(cors());

  app.use((req: Request, res: Response<any, IResponseLocals>, next: NextFunction) => {
    res.locals.timer = {
      start: new Date(),
      startTime: process.hrtime(),
    };

    res.on('close', async () => {
      res.locals.timer.durationToClose = getDurationInMilliseconds(res.locals.timer.startTime);

      await Logger.api(LogLevel.INFO, {
        controller: res.locals.controller,
        method: APIMethod[req.method.toUpperCase() as keyof typeof APIMethod],
        endpoint: req.route?.path ?? req.path,
        ipRequest: req.ip,
        httpResultCode: res.statusCode,
        durationMs: res.locals.timer.durationToClose,
        requestParams: req.params,
        requestQuery: req.query,
        requestBody: req.body,
        responseBody: res.locals.responseBody,
        user: null,
      });
    });

    next();
  });

  app.use((req: Request, res: Response<any, IResponseLocals>, next: NextFunction) => {
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

  // app.use(
  //   '/api-docs',
  //   swaggerUi.serve,
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   swaggerUi.setup(require(path.join(appRoot.toString(), './swagger.json'))),
  // );

  app.use(
    (
      error: Error | createError.HttpError,
      req: Request,
      res: Response<any, IResponseLocals>,
      _next: NextFunction,
    ) => {
      Logger.error(error);
      HttpResponseError.sendError(error, req, res);
    },
  );

  return app;
};
