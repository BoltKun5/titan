import { Request, Response, NextFunction } from 'express';
import { ILocals } from '../../core';
import { set as httpContextSet } from 'express-http-context';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { upperFirst } from 'lodash';
import { get } from 'stack-trace';
import { extensionFileToImport } from '../../utils/import.utils';

const CONTROLLER_FILE_ENDS_WITH = `.controller${extensionFileToImport()}`;

export default async (
  req: Request,
  res: Response<any, ILocals>,
  next: NextFunction,
): Promise<void> => {
  httpContextSet('reqId', uuidv4());

  const originalJson = res.json;
  const originalSend = res.send;

  res.send = function (...args): Response<unknown, ILocals> {
    const controllers = get();

    const traceController = controllers.find((controller) => {
      return controller.getFileName()?.endsWith(CONTROLLER_FILE_ENDS_WITH);
    });

    const controllerName = traceController?.getFileName() || 'Unknown Controller';

    res.locals.controller = path
      .basename(controllerName.replace(CONTROLLER_FILE_ENDS_WITH, 'Controller'))
      .split('.')
      .map((word) => upperFirst(word))
      .join('');

    return originalSend.apply(res, args);
  };

  res.json = function (...args): Response<unknown, ILocals> {
    res.locals.responseBody = args[0];
    return originalJson.apply(res, args);
  };
  next();
};
