import {IResponseLocals} from "../../local_core";
import {IResponse} from "../../local_core/types/types/interface";
import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import Auth from "../middlewares/auth";
import {Card, CardSerie, CardSet} from "../../database";
import sequelize from "sequelize";

const route = Router();

export const CardListRouter = (app: Router): Router => {
  app.use("/cardlist", route);

  route.get(
    "/:serieId/:setId",
    asyncHandler(async (req: Request<any, any, void, { serieId: string, setId: string }>, res: Response<IResponse<any>, IResponseLocals>) => {
      const set = await CardSet.findOne({
        where: {code: req.params.serieId + req.params.setId},
      });
      try {

        const cards = await Card.findAll({
          where: {
            setId: set.id,
          },
          order: [[sequelize.cast(sequelize.col('Card.localId'), 'integer'), 'ASC']],
        })
        set.setDataValue('cards', cards);
        res.json({data: {set: set}});
      } catch (e) {
        console.error(e)
      }

    }));

  //TODO: Typer la query correctement
  route.get(
    "/:serieId",
    Auth,
    asyncHandler(async (req: Request<any, any, void, { serieId: string }>, res: Response<IResponse<any>, IResponseLocals>) => {
      const serie = await CardSerie.findOne({
        where: {code: req.params.serieId},
        include: [{
          model: CardSet,
          as: "card",
          order: [sequelize.col('CardSet.releaseDate'), 'ASC'],
        }],
      });

      res.json({
        data: serie,
      });
    }),
  );

  return route;
};
