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

const route = Router();

export const DevtoolRouter = (app: Router): Router => {
  app.use("/devtool", route);

  route.post(
    "/rarity",
    asyncHandler(async (req: Request<any, any, any, any>, res: Response<any, any>) => {
      Card.update({
        rarity: req.body.rarity,
      }, {
        where: {
          id: req.body.cardId,
        },
      })
      console.log("card "+req.body.cardId+ " : " + req.body.rarity)
      res.json(
        {msg: "ok"},
      )
    }),
  );

  return route;
};
