import { Request, Response, Router } from 'express';
import { Card, CardSerie, CardSet } from '../../database';
import sequelize from 'sequelize';
import auth from '../middlewares/auth';
import { IResponse } from 'vokit_core';
import { ILocals } from '../../core';
import { HttpResponseError } from '../../modules/http-response-error';

const route = Router();

export const SeriesRouter = (app: Router): Router => {
  app.use('/series', route);

  route.get(
    '/allSeries',
    async (
      req: Request<any, any, void, { serieId: string }>,
      res: Response<IResponse<any>, ILocals>,
    ) => {
      const series = await CardSerie.findAll({
        include: [
          {
            model: CardSet,
            as: 'cardSets',
          },
        ],
        order: [[{ model: CardSet, as: 'cardSets' }, 'releaseDate', 'DESC']],
      });
      res.json({
        data: series,
      });
    },
  );

  route.get(
    '/set/:setId',
    async (
      req: Request<any, any, void, { serieId: string; setId: string }>,
      res: Response<IResponse<any>, ILocals>,
    ) => {
      const set = await CardSet.findOne({
        where: { code: req.params.setId },
      });

      if (!set) {
        throw HttpResponseError.createNotFoundError();
      }

      try {
        const cards = await Card.findAll({
          where: {
            setId: set.id,
          },
          order: [[sequelize.col('Card.localId'), 'ASC']],
        });
        set.setDataValue('cards', cards);
        res.json({ data: { set: set } });
      } catch (e) {
        console.error(e);
      }
    },
  );

  //TODO: Typer la query correctement
  route.get(
    '/serie/:serieId',
    auth,
    async (
      req: Request<any, any, void, { serieId: string }>,
      res: Response<IResponse<any>, ILocals>,
    ) => {
      const serie = await CardSerie.findOne({
        where: { code: req.params.serieId },
      });
      try {
        if (!serie) {
          throw HttpResponseError.createNotFoundError();
        }

        const cardSets = await CardSet.findAll({
          where: {
            cardSerieId: serie.id,
          },
          order: [[sequelize.col('CardSet.releaseDate'), 'DESC']],
        });
        serie.setDataValue('cardSets', cardSets);

        res.json({ data: { serie: serie } });
      } catch (e) {
        console.error(e);
      }

      res.json({
        data: serie,
      });
    },
  );

  return route;
};
