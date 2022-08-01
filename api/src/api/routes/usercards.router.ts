import {IResponseLocals} from "../../local_core";
import {
  IResponse,
  IUpdateUserCardsBody, IUpdateUserCardsResponse,
} from "../../local_core/types/types/interface";
import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import Auth from "../middlewares/auth";
import {UserCardPossession} from "../../database/models/UserCardPossession";

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

  return route;
};
