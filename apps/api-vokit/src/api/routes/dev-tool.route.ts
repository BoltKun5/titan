import { CardSerie } from '../../database/models/card-serie.model';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Card, CardSet } from '../../database';
import { Op } from 'sequelize';

const route = Router();

export const DevtoolRouter = (app: Router): Router => {
  app.use('/devtool', route);

  route.post(
    '/rarity',
    asyncHandler(async (req: Request<any, any, any, any>, res: Response<any, any>) => {
      Card.update(
        {
          rarity: req.body.rarity,
        },
        {
          where: {
            id: req.body.cardId,
          },
        },
      );
      console.log('card ' + req.body.cardId + ' : ' + req.body.rarity);
      res.json({ msg: 'ok' });
    }),
  );

  route.get(
    '/bugged',
    asyncHandler(async (req: Request<any, any, any, any>, res: Response<any, any>) => {
      const cards = await Card.findAll({
        where: {
          rarity: {
            [Op.in]: [8, 7, 4, 2],
          },
          canBeReverse: false,
        },
        include: [
          {
            model: CardSet,
            required: true,
            duplicating: false,
            attributes: {
              exclude: [
                'isPlayableInExpanded',
                'isPlayableInStandard',
                'id',
                'releaseDate',
                'tcgOnline',
              ],
            },
            as: 'cardSet',
            include: [
              {
                where: {
                  code: ['xy', 'swsh'],
                },
                model: CardSerie,
                required: true,
                duplicating: false,
                as: 'cardSerie',
              },
            ],
          },
        ],
      });
      cards.forEach((card) => {
        card.update({ canBeReverse: true });
      });
      res.json({ cards });
    }),
  );

  return route;
};
