import { IResponseLocals } from "../../local_core";
import {
  IResponse,
  ISigninAuthBody,
  ISigninAuthResponse, IUpdateUserCardsBody
} from "../../local_core/types/types/interface";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import AuthValidation from "../validations/auth.validation";
import { token } from "../../utils/auth.utils";
import { HttpResponseError } from "../../modules/HttpResponseError";
import createError from "http-errors";
import { Code, ErrorType } from "abyss_crypt_core";
import Auth from "../middlewares/auth";
import { UserCardPossession } from "../../database/models/UserCardPossession";
import { Card } from "../../database";

const route = Router();

export const UserCardsRouter = (app: Router): Router => {
  app.use("/usercards", route);
  app.use("/usercards", Auth);

  route.post(
    "/:id",
    asyncHandler(async (req: Request<any, any, IUpdateUserCardsBody>, res: any) => {
      req.body.cards.map(async (card) => {
        const currentCard = await Card.findOne({
          where:
            {
              id: card.cardId
            }
        });
        await UserCardPossession.upsert({
          card: currentCard,
          user: res.locals.currentUser,
          classicQuantity: card.classicQuantity,
          reverseQuantity: card.reverseQuantity
        });
      });
      res.json({ ok: req.params.id });
    })
  );

  return route;
};
