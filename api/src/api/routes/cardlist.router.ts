import {IResponseLocals} from "../../local_core";
import {IResponse} from "../../local_core/types/types/interface";
import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import {Card, CardSerie, CardSet} from "../../database";
import sequelize from "sequelize";

const route = Router();

export const CardListRouter = (app: Router): Router => {
  app.use("/cardlist", route);

  //TODO: Typer la query correctement
  route.get(
    "/allSeries",
    asyncHandler(async (req: Request<any, any, void, { serieId: string }>, res: Response<IResponse<any>, IResponseLocals>) => {
      const series = await CardSerie.findAll();
      res.json({
        data: series,
      });
    }),
  );

  route.get(
    "/set/:setId",
    asyncHandler(async (req: Request<any, any, void, { serieId: string, setId: string }>, res: Response<IResponse<any>, IResponseLocals>) => {
      const set = await CardSet.findOne({
        where: {code: req.params.setId},
      });
      try {

        const cards = await Card.findAll({
          where: {
            setId: set.id,
          },
          order: [[sequelize.col('Card.localId'), 'ASC']],
        })
        set.setDataValue('cards', cards);
        res.json({data: {set: set}});
      } catch (e) {
        console.error(e)
      }

    }));

  //TODO: Typer la query correctement
  route.get(
    "/serie/:serieId",
    asyncHandler(async (req: Request<any, any, void, { serieId: string }>, res: Response<IResponse<any>, IResponseLocals>) => {
      const serie = await CardSerie.findOne({
        where: {code: req.params.serieId},
      });
      try {
        if (!serie) res.json({error: {code: 'SERIE_NOT_FOUND'}});
        const cardSets = await CardSet.findAll({
          where: {
            cardSerieId: serie.id,
          },
          order: [[sequelize.col('CardSet.releaseDate'), 'DESC']],
        })
        serie.setDataValue('cardSets', cardSets);

        res.json({data: {serie: serie}});
      } catch (e) {
        console.error(e)
      }

      res.json({
        data: serie,
      });
    }),
  );

  return route;
};
