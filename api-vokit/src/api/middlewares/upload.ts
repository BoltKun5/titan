import multer from 'multer';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export default class UploadMiddleware {
  public static readonly diskLoader = async (
    req: Request,
    res: Response,
    size?: number,
  ): Promise<{ req: Request; res: Response }> => {
    return new Promise((resolve) => {
      const x = multer({
        storage: multer.diskStorage({
          destination: (_req, _file, cb) => {},
          filename: function (req, file, cb) {
            cb(null, uuidv4());
          },
        }),
        limits: {
          ...(size ? { fileSize: size } : {}),
        },
      }).single('file');

      x(req, res, () => {
        return resolve({
          req,
          res,
        });
      });
    });
  };
}
