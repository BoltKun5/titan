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
    "/:id/update",
    Auth,
    asyncHandler(async (req: Request<any, any, IUpdateUserCardsBody>, res: Response<IResponse<IUpdateUserCardsResponse>, IResponseLocals>) => {
      req.body.cards.map(async (card) => {
        const currentCard = await Card.findOne({
          where:
            {
              id: card.cardId,
            },
        });
        await UserCardPossession.upsert({
          cardId: currentCard.id,
          userId: res.locals.currentUser.id,
          classicQuantity: card.classicQuantity,
          reverseQuantity: card.reverseQuantity,
        });
      });
      res.json({data: {code: "CARDS_UPDATED"}});
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
