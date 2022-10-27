import { CardRarityEnum, IResponseLocals, StatisticsDataType } from "./../../../../local-core";
import { IResponse } from "./../../../../local-core";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { Card } from "../../database";
import auth from "../middlewares/auth";
import { getFilterConfig } from "../utils/getFilterConfig";

const route = Router();

export const CardListRouter = (app: Router): Router => {
  app.use("/cardlist", route);

  //TODO: Typer les queries

  route.get(
    "/collection",
    auth,
    asyncHandler(async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      const cards = await Card.findAll({
        ...getFilterConfig(req, res, 'collection'),
      });
      const count = await Card.count({
        ...getFilterConfig(req, res, 'collection')
      })

      const page = Number(req.query?.page) ?? 0

      res.json({
        data: {
          cards,
          pagination: {
            total: count,
            page,
            totalPages: Math.ceil(count / 200),
            resultPerPage: 200
          }
        }
      });
    }),
  );

  route.get(
    "/cards",
    asyncHandler(async (req: Request<any, any, void>, res: Response<IResponse<any>, IResponseLocals>) => {
      const cards = await Card.findAll(getFilterConfig(req, res, 'cards'));
      const count = await Card.count({
        ...getFilterConfig(req, res, 'cards')
      })

      const page = Number(req.query?.page) ?? 0

      res.json({
        data: {
          cards,
          pagination: {
            total: count,
            page,
            totalPages: Math.ceil(count / 200),
            resultPerPage: 200
          }
        }
      });
    }),
  );

  route.get(
    "/stats",
    auth,
    asyncHandler(async (req: Request<any, any, void>, res: Response<IResponse<StatisticsDataType>, IResponseLocals>) => {
      const cards = await Card.findAll({
        ...getFilterConfig(req, res, 'collection'),
      });

      const stats: StatisticsDataType = {
        distinctPossible: 0,
        distinctOwned: 0,
        distinctNormal: 0,
        distinctNormalPossible: 0,
        distinctReverse: 0,
        distinctReversePossible: 0,

        totalOwned: 0,
        totalNormal: 0,
        totalReverse: 0,

        countByRarity: {
          "Common": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
          "Uncommon": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
          "Rare": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
          "Holo": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
          "Ultra Rare": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
          "Secret Rare": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
          "None": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
          "Amazing": {
            totalOwned: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          },
        },
        countBySet: {},
      };

      cards.forEach((card) => {
        if (!stats.countBySet[card.cardSet.code]) {
          stats.countBySet[card.cardSet.code] = {
            totalNormal: 0,
            totalReverse: 0,
            totalOwned: 0,
            distinctNormal: 0,
            distinctReverse: 0,
            distinctPossibleNormal: 0,
            distinctPossibleReverse: 0,
            distinctOwned: 0,
            distinctPossible: 0,
          };
        }

        if (card?.userCardPossessions?.[0]) {
          stats.totalReverse += card.userCardPossessions[0].reverseQuantity;
          stats.totalNormal += card.userCardPossessions[0].classicQuantity;
          stats.distinctNormal += (card.userCardPossessions[0].classicQuantity > 0 ? 1 : 0)
          stats.distinctReverse += (card.userCardPossessions[0].reverseQuantity > 0 ? 1 : 0)

          stats.countBySet[card.cardSet.code].totalNormal += card.userCardPossessions[0].classicQuantity;
          stats.countBySet[card.cardSet.code].totalReverse += card.userCardPossessions[0].reverseQuantity;

          stats.countBySet[card.cardSet.code].distinctNormal += (card.userCardPossessions[0].classicQuantity > 0 ? 1 : 0)
          stats.countBySet[card.cardSet.code].distinctReverse += (card.userCardPossessions[0].reverseQuantity > 0 ? 1 : 0)

          stats.countBySet[card.cardSet.code].distinctOwned += (card.userCardPossessions[0].classicQuantity > 0 ? 1 : 0);
          stats.countBySet[card.cardSet.code].distinctOwned += (card.userCardPossessions[0].reverseQuantity > 0 ? 1 : 0);
          stats.countByRarity[CardRarityEnum[card.rarity]].distinctOwned += (card.userCardPossessions[0].reverseQuantity
            > 0 || card.userCardPossessions[0].classicQuantity > 0 ? 1 : 0);
          stats.countByRarity[CardRarityEnum[card.rarity]].totalOwned += card.userCardPossessions[0].classicQuantity + card.userCardPossessions[0].reverseQuantity
        }

        stats.distinctNormalPossible++;
        stats.distinctReversePossible += (card.canBeReverse ? 1 : 0);

        stats.countBySet[card.cardSet.code].distinctPossibleNormal++;
        stats.countBySet[card.cardSet.code].distinctPossibleReverse += (card.canBeReverse ? 1 : 0);

        stats.countByRarity[CardRarityEnum[card.rarity]].distinctPossible++;

      });

      stats.totalOwned = stats.totalReverse + stats.totalNormal;
      stats.distinctOwned = stats.distinctReverse + stats.distinctNormal
      stats.distinctPossible = stats.distinctReversePossible + stats.distinctNormalPossible

      for (const [key, value] of Object.entries(stats.countBySet)) {
        stats.countBySet[key].distinctPossible = value.distinctPossibleNormal + value.distinctPossibleReverse;
        stats.countBySet[key].totalOwned = value.totalNormal + value.totalReverse;
      }

      res.json({
        data: stats,
      });
    }),
  )

  return route;
};
