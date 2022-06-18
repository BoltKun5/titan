import express, { Response, Request, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import routes from '../api';
import { HttpResponseError } from '../modules/HttpResponseError';
import AppConfig from '../modules/AppConfig';
import Logger from '../modules/Logger';
import { get } from 'stack-trace';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import appRoot from 'app-root-path';
import { IResponseLocals } from '../local_core';
import { getDurationInMilliseconds } from 'abyss_core';
import { APIMethod, LogLevel } from 'abyss_crypt_core';

export default ({ app }: { app: express.Application }): express.Application => {
  app.disable('x-powered-by');

  app.use(cors());

  app.use((req: Request, res: Response<any, IResponseLocals>, next: NextFunction) => {
    const originalJson = res.json;
    const originalSend = res.send;

    res.send = function (...args): Response<any, IResponseLocals> {
      let traceController: string;

      for (const controller of get())
        if (controller.getFileName()?.includes('.controller.ts')) {
          traceController = controller.getFileName();
          break;
        }

      res.locals.controller = traceController ? path.basename(traceController).split('.')[0] : null;
      return originalSend.apply(res, args);
    };

    res.json = function (...args): Response<any, IResponseLocals> {
      res.locals.responseBody = { ...JSON.parse(JSON.stringify(args[0])) };

      return originalJson.apply(res, args);
    };
    next();
  });

  app.use((req: Request, res: Response<any, IResponseLocals>, next: NextFunction) => {
    res.locals.timer = {
      start: new Date(),
      startTime: process.hrtime(),
    };

    res.on('close', async () => {
      res.locals.timer.durationToClose = getDurationInMilliseconds(res.locals.timer.startTime);

      await Logger.api(LogLevel.INFO, {
        controller: res.locals.controller,
        method: APIMethod[req.method.toUpperCase()],
        endpoint: req.route?.path ?? req.path,
        ipRequest: req.ip,
        httpResultCode: res.statusCode,
        durationMs: res.locals.timer.durationToClose,
        requestParams: req.params,
        requestQuery: req.query,
        requestBody: req.body,
        responseBody: res.locals.responseBody,
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

  app.use(
    '/api-docs',
    swaggerUi.serve,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    swaggerUi.setup(require(path.join(appRoot.toString(), './swagger.json'))),
  );

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
