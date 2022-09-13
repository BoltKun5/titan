import { IResponseLocals } from "../../local_core";
import {
  IIncrementManyUserCardsBody,
  IIncrementUserCardsBody,
  IResponse,
  IUpdateUserCardsBody, IUpdateUserCardsResponse,
} from "../../local_core/types/types/interface";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import Auth from "../middlewares/auth";
import { UserCardPossession } from "../../database/models/UserCardPossession";

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

      res.json({ data: { code: "CARDS_UPDATED", result } });
    }),
  );

  route.post(
    "/increment",
    Auth,
    asyncHandler(async (req: Request<any, any, IIncrementUserCardsBody>, res: Response<IResponse<IUpdateUserCardsResponse>, IResponseLocals>) => {
      const existing = await UserCardPossession.findOne({
        where: {
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
        },
      });
      console.log((req.body.type === "normal" ? { classicQuantity: existing.classicQuantity += 1 } : { reverseQuantity: existing.reverseQuantity += 1 }),)
      let result;
      if (existing === null) {
        result = await UserCardPossession.create({
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
          ...(req.body.type === "normal" ? { reverseQuantity: 0, classicQuantity: 1 } : {
            reverseQuantity: 1,
            classicQuantity: 0,
          }),
        })
      } else {
        result = await existing.update({
          ...(req.body.type === "normal" ? { classicQuantity: existing.classicQuantity += 1 } : { reverseQuantity: existing.reverseQuantity += 1 }),
        });
      }

      res.json({ data: { code: "CARDS_UPDATED", result } });
    }),
  );

  route.post(
    "/incrementMany",
    Auth,
    asyncHandler(async (req: Request<any, any, IIncrementManyUserCardsBody>, res: Response<IResponse<IUpdateUserCardsResponse>, IResponseLocals>) => {
      const result = [];
      for (const card of req.body.cards) {
        const existing = await UserCardPossession.findOne({
          where: {
            cardId: card.cardId,
            userId: res.locals.currentUser.id,
          },
        });
        if (existing === null) {
          result.push(await UserCardPossession.create({
            cardId: card.cardId,
            userId: res.locals.currentUser.id,
            ...(card.type === "normal" ? { reverseQuantity: 0, classicQuantity: 1 } : {
              reverseQuantity: 1,
              classicQuantity: 0,
            }),
          }));
        } else {
          result.push(await existing.update({
            ...(card.type === "normal" ? { classicQuantity: existing.classicQuantity += 1 } : { reverseQuantity: existing.reverseQuantity += 1 }),
          }));
        }
      }

      res.json({ data: { code: "CARDS_UPDATED", result } });
    }),
  );

  return route;
};
