import {IResponseLocals} from "../../local_core";
import {IGetUserCardsResponse, IResponse} from "../../local_core/types/types/interface";
import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import Auth from "../middlewares/auth";
import {UserCardPossession} from "../../database/models/UserCardPossession";
import {Card, CardSet} from "../../database";
import {fullCardsConfig} from "../../local_core/sequelize_config/cards";
import sequelize from "sequelize";

const route = Router();

export const CardListRouter = (app: Router): Router => {
  app.use("/cardlist", route);

  route.get(
    "/:serieId/:setId",
    asyncHandler(async (req: Request<any, any, void, { serieId: string, setId: string }>, res: Response<IResponse<any>, IResponseLocals>) => {
      console.time('a')
      const set = await CardSet.findOne({
        where:
          {code: req.params.serieId + req.params.setId},
      });
      console.timeEnd('a')
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
          include: fullCardsConfig,
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
