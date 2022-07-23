import {IResponseLocals} from "../../local_core";
import {
  IGetUserCardsResponse,
  IResponse,
  IUpdateUserCardsBody, IUpdateUserCardsResponse,
} from "../../local_core/types/types/interface";
import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import Auth from "../middlewares/auth";
import {UserCardPossession} from "../../database/models/UserCardPossession";
import {Card, CardAttack, CardAttribute} from "../../database";
import {CardType} from "../../database/models/CardType";
import {CardAttackCost} from "../../database/models/CardAttackCost";
import {CardDamageModification} from "../../database/models/CardDamageModification";
import {CardDexId} from "../../database/models/CardDexId";
import {CardAbility} from "../../database/models/CardAbility";

const route = Router();

export const UserCardsRouter = (app: Router): Router => {
  app.use("/usercards", route);

  route.post(
    "/update",
    Auth,
    asyncHandler(async (req: Request<any, any, IUpdateUserCardsBody>, res: Response<IResponse<IUpdateUserCardsResponse>, IResponseLocals>) => {
      const existing = await UserCardPossession.findOne({
        where: {
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
        },
      });
      let result;
      if (existing === null) {
        result = await UserCardPossession.create({
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
          classicQuantity: req.body.classicQuantity,
          reverseQuantity: req.body.reverseQuantity,
        })
      } else {
        result = await existing.update({
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
          classicQuantity: req.body.classicQuantity,
          reverseQuantity: req.body.reverseQuantity,
        });
      }

      res.json({data: {code: "CARDS_UPDATED", result}});
    }),
  );

  //TODO: Typer la query correctement
  route.get(
    "/:id/getAll",
    Auth,
    asyncHandler(async (req: Request<any, any, void, { page, itemPerPage }>, res: Response<IResponse<IGetUserCardsResponse>, IResponseLocals>) => {
      const cards = await UserCardPossession.findAll({
        where: {
          userId: res.locals.currentUser.id,
        },
        attributes: ["classicQuantity", "reverseQuantity"],
        include: [{
          model: Card,
          as: "card",
          include: [
            {
              model: CardType,
              as: "types",
            },
            {
              model: CardAttack,
              as: "attacks",
              include: [{
                model: CardAttackCost,
                as: "costs",
              }],
            },
            {
              model: CardAbility,
              as: "abilities",
            },
            {
              model: CardDamageModification,
              as: "damageModifications",
            },
            {
              model: CardAttribute,
              as: "attributes",
            },
            {
              model: CardDexId,
              as: "dexIds",
            },
          ],
        }],
        // limit: req.query?.itemPerPage ?? "25",
        // offset: toNumber(req.query?.page) - 1 ?? 0,
      });

      res.json({
        data: {
          totalCards: cards.length,
          cardsList: cards,
          paginationOptions: {
            page: req.query.page,
            itemPerPage: req.query.itemPerPage,
          },
        },
      });
    }),
  );

  return route;
};
