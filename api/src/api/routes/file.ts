import { RequestHandler, Router } from 'express';
import asyncHandler from 'express-async-handler';
import FileController from '../controllers/file.controller';
import { disableTimeout } from '../middlewares/disableTimeout';

const route = Router();

export const FileRouter = (app: Router): Router => {
  app.use('/', route);

  route.post(
    '/files/encrypt',
    disableTimeout,
    asyncHandler(FileController.encrypt as unknown as RequestHandler),
  );
  route.post(
    '/files/decrypt',
    disableTimeout,
    asyncHandler(FileController.decrypt as unknown as RequestHandler),
  );

  return route;
};
