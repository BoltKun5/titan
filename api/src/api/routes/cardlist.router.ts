import {IResponseLocals} from "../../local_core";
import {IResponse} from "../../local_core/types/types/interface";
import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import {Card, CardAttack, CardAttribute, CardSerie, CardSet} from "../../database";
import sequelize from "sequelize";
import Sequelize from "sequelize";
import {CardType} from "../../database/models/CardType";
import {CardAttackCost} from "../../database/models/CardAttackCost";
import {CardAbility} from "../../database/models/CardAbility";
import {CardDamageModification} from "../../database/models/CardDamageModification";
import {CardDexId} from "../../database/models/CardDexId";
import {UserCardPossession} from "../../database/models/UserCardPossession";
import auth from "../middlewares/auth";
import {getFilterConfig} from "../utils/getFilterConfig";

const route = Router();

export const CardListRouter = (app: Router): Router => {
  app.use("/cardlist", route);

  route.get(
    "/allSeries",
    asyncHandler(async (req: Request<any, any, void, { serieId: string }>, res: Response<IResponse<any>, IResponseLocals>) => {
      const series = await CardSerie.findAll({
        include: [{
          model: CardSet,
          as: 'cardSets',
        }],
        order: [
          [{model: CardSet, as: 'cardSets'}, 'releaseDate', 'ASC']],

      });
      res.json({
        data: series,
      });
    }),
  );

  //TODO: Typer la query correctement
  route.get(
    "/collection",
    auth,
    asyncHandler(async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      const cards = await Card.findAll(getFilterConfig(req, res, 'collection'));
      res.json({
        data: cards,
      });
    }),
  );

  route.get(
    "/cards",
    asyncHandler(async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      const cards = await Card.findAll(getFilterConfig(req, res, 'cards'));
      res.json({
        data: cards,
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
