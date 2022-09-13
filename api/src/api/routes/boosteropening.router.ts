import {CardRarityEnum, IResponseLocals, StatisticsDataType} from "../../local_core";
import {ICollectionCardlistQuery, IResponse} from "../../local_core/types/types/interface";
import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import {Card, CardSerie, CardSet} from "../../database";
import sequelize from "sequelize";
import auth from "../middlewares/auth";
import {getFilterConfig} from "../utils/getFilterConfig";
import {UserCardPossession} from "../../database/models/UserCardPossession";
import {include} from "underscore";

const route = Router();

export const BoosterOpeningRouter = (app: Router): Router => {
  app.use("/booster", route);

  route.get(
    "/card",
    asyncHandler(async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      const card = await Card.findOne({
        where: {
          setId: req.query.setId,
          localId: req.query.localId
        },
        include: [
          {
            model: CardSet,
            as: 'cardSet'
          }
        ]
      });
      res.json({
        data: card,
      });
    }),
  );

  return route;
};
