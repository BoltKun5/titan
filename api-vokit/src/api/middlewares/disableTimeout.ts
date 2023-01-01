import { Request, Response, NextFunction } from 'express';

export const disableTimeout = (req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(0);
  res.setTimeout(0);
  next();
};
