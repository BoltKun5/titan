import { Request, Response, NextFunction } from 'express';
import { ILocals } from '../../core';
import LoggerModule from '../../modules/logger.module';
import { get as httpContextGet } from 'express-http-context';
import { uniq } from 'lodash';
import { getDurationInMilliseconds } from '../../utils/duration.utils';
import { APIMethod, IResponse, LogLevel, LogType } from 'vokit_core';

export default async (
  req: Request,
  res: Response<IResponse<Record<string, unknown>>, ILocals>,
  next: NextFunction,
): Promise<void> => {
  res.locals.timer = {
    start: new Date(),
    startTime: process.hrtime(),
  };

  res.on('close', async () => {
    try {
      res.locals.timer.durationToClose = getDurationInMilliseconds(res.locals.timer.startTime);

      // Note(Mehdi): Getting all remote IP address
      const ips = Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for']
        : [...(req.headers['x-forwarded-for'] ? [req.headers['x-forwarded-for']] : [])];
      ips.push(...(req.socket.remoteAddress ? [req.socket.remoteAddress] : []));
      ips.push(...(req.ip ? [req.ip] : []));

      await LoggerModule.logApiRequest(LogLevel.INFO, {
        requestId: httpContextGet('reqId'),
        requestStartDate: res.locals.timer.start,
        controller: res.locals.controller,
        method: APIMethod[req.method.toUpperCase() as keyof typeof APIMethod],
        endpoint: req.route?.path ?? req.path,
        requestIps: uniq(ips),
        httpResultCode: res.statusCode,
        durationInMs: res.locals.timer.durationToClose,
        requestParams: req.params,
        requestQuery: req.query,
        requestBody: req.body,
        responseBody: res.locals.responseBody as unknown as Record<string, unknown>,
        user: res.locals.currentUser || null,
        isAdmin: res.locals.isAdmin,
      });
    } catch (error: any) {
      LoggerModule.error(error, { type: LogType.API });
    }
  });

  next();
};
