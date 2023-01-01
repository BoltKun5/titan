import { Request, Response, Router } from 'express';
import { IResponse, IResponseLocals } from '../../../../local-core';
import { Card, CardSet } from '../../database';
import auth from '../middlewares/auth';

const route = Router();

export const BoosterOpeningRouter = (app: Router): Router => {
  app.use('/booster', route);

  route.get(
    '/card',
    auth,
    async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      const card = await Card.findOne({
        where: {
          setId: req.query.setId,
          localId: req.query.localId,
        },
        include: [
          {
            model: CardSet,
            as: 'cardSet',
          },
        ],
      });
      res.json({
        data: card,
      });
    },
  );

  return route;
};
