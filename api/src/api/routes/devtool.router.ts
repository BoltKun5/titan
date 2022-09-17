import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { Card } from "../../database";

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
      console.log("card " + req.body.cardId + " : " + req.body.rarity)
      res.json(
        { msg: "ok" },
      )
    }),
  );

  return route;
};
