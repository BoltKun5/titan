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
      let mainOrder;
      if (req.query?.order) {
        switch (req.query.order) {
          case "default":
            mainOrder = [[{model: CardSet, as: "cardSet"}, 'releaseDate', 'desc'], ['localId', 'asc']];
            break;
          case "name":
            mainOrder = [['name', 'asc']];
            break;
          case "type":
            mainOrder = [[{model: CardType, as: "types"}, 'type', 'asc']]
        }
      }
      const cards = await Card.findAll({
        where: {...(req.query.namefilter ? {name: {[Sequelize.Op.iLike]: `%${req.query.namefilter}%`}} : {})},
        order: mainOrder,
        attributes: {exclude: ["cardSet"]},
        include: [
          {
            model: UserCardPossession,
            as: "userCardPossessions",
            required: (req.query.unowned ? (req.query.unowned !== 'show') : false),
            duplicating: false,
            where: {
              [sequelize.Op.and]: [
                {
                  [sequelize.Op.or]: [
                    {
                      classicQuantity: {
                        [sequelize.Op.gt]: 0,
                      },
                    },
                    {
                      reverseQuantity: {
                        [sequelize.Op.gt]: 0,
                      },
                    },
                  ],
                },
                {
                  userId: res.locals.currentUser.id,
                },
              ],
            },
          },
          {
            model: CardType,
            as: "types",
          },
          {
            where: {...(req.query.setfilter ? {code: req.query.setfilter} : {})},
            model: CardSet,
            duplicating: false,
            attributes: {
              exclude: ["cardSerieId", "isPlayableInExpanded", "isPlayableInStandard", "id", "name", "releaseDate", "tcgOnline"],
            },
            as: "cardSet",
          },
        ],
        limit: 300,
        subQuery: false,
      });
      res.json({
        data: cards,
      });
    }),
  );

  route.get(
    "/cards",
    asyncHandler(async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      let mainOrder;
      if (req.query?.order) {
        switch (req.query.order) {
          case "default":
            mainOrder = [[{model: CardSet, as: "cardSet"}, 'releaseDate', 'desc'], ['localId', 'asc']];
            break;
          case "name":
            mainOrder = [['name', 'asc']];
            break;
          case "type":
            mainOrder = [[{model: CardType, as: "types"}, 'type', 'asc']]
        }
      }
      const cards = await Card.findAll({
        limit: 1000,
        where: {...(req.query.namefilter ? {name: {[Sequelize.Op.like]: `%${req.query.namefilter}%`}} : {})},
        order: mainOrder,
        subQuery: false,
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
          {
            where: {...(req.query.setfilter ? {code: req.query.setfilter} : {})},
            model: CardSet,
            as: "cardSet",
            include: [
              {
                model: CardSerie,
                as: "cardSerie",
              },
            ],
          },
        ],
      });
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
