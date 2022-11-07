import { include } from 'underscore';
import { getCardAttributesExcludeArray } from './../utils/getAttributeExcludeList';
import { CardPossessionHistoric } from './../../database/models/CardPossessionHistoric';
import { IHistoricResponse, IHistoricQuery } from '././../../../../local-core';
import { IResponseLocals } from "./../../../../local-core";
import {
  IIncrementManyUserCardsBody,
  IIncrementUserCardsBody,
  IResponse,
  IUpdateUserCardsBody, IUpdateUserCardsResponse,
} from "./../../../../local-core";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import Auth from "../middlewares/auth";
import { UserCardPossession } from "../../database/models/UserCardPossession";
import { v4 } from "uuid";
import { Card } from '../../database/models/Card';
import { CardSet } from '../../database';
import { Op } from 'sequelize';

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
      const options = {
        boosterId: v4()
      }
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
          }, options as any));
        } else {
          result.push(await existing.update({
            ...(card.type === "normal" ? { classicQuantity: existing.classicQuantity += 1 } : { reverseQuantity: existing.reverseQuantity += 1 }),
          }, options as any));
        }
      }

      res.json({ data: { code: "CARDS_UPDATED", result } });
    }),
  );

  route.get(
    "/historic",
    Auth,
    asyncHandler(async (req: Request<any, any, IHistoricQuery>, res: Response<IResponse<IHistoricResponse>, IResponseLocals>) => {

      const result = await CardPossessionHistoric.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          where: {
            userId: req.query.userId
          },
          model: UserCardPossession,
          required: true,
          duplicating: false,
          attributes: {
            exclude: ["cardId", "classicQuantity", "createdAt", "reverseQuantity", "updatedAt", "userId"],
          },
          include: [{
            model: Card,
            duplicating: false,
            as: 'card',
            attributes: {
              exclude: getCardAttributesExcludeArray(['localId', 'name'])
            },
            include: [{
              model: CardSet,
              duplicating: false,
              as: 'cardSet',
              attributes: {
                exclude: ["cardCount", "cardSerieId", "isPlayableInExpanded", "isPlayableInStandard", "releaseDate", "tcgOnline"]
              },
            }]
          }]
        }]
      })
      res.json({ data: { result } });
    }),
  );

  route.get(
    "/boosters",
    Auth,
    asyncHandler(async (req: Request<any, any, IHistoricQuery>, res: Response<IResponse<any>, IResponseLocals>) => {

      const result = await CardPossessionHistoric.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          where: {
            userId: req.query.userId
          },
          model: UserCardPossession,
          required: true,
          duplicating: false,
          attributes: {
            exclude: ["cardId", "classicQuantity", "createdAt", "reverseQuantity", "updatedAt", "userId"],
          },
          include: [{
            model: Card,
            duplicating: false,
            as: 'card',
            attributes: {
              exclude: getCardAttributesExcludeArray(['localId', 'name'])
            },
            include: [{
              model: CardSet,
              duplicating: false,
              as: 'cardSet',
              attributes: {
                exclude: ["cardCount", "cardSerieId", "isPlayableInExpanded", "isPlayableInStandard", "releaseDate", "tcgOnline"]
              },
            }]
          }]
        }],
        where: {
          boosterId: {
            [Op.ne]: null
          }
        }
      });

      let filteredBoosters = [];

      result.forEach((el) => {
        let boosterElement: any = filteredBoosters.find((booster) => booster.id === el.boosterId);

        if (!boosterElement) {
          filteredBoosters.push({
            createdAt: el.createdAt,
            cardSet: el.cardPossession.card.cardSet,
            id: el.boosterId,
            cards: []
          })
          boosterElement = filteredBoosters.find((booster) => booster.id === el.boosterId);
        }

        boosterElement.cards.push({
          id: el.cardPossession.card.id,
          localId: el.cardPossession.card.localId,
          name: el.cardPossession.card.name,
          type: (el.oldClassicQuantity < el.newClassicQuantity) ? 'classic' : 'reverse'
        });
      });

      res.json({ data: filteredBoosters });
    }),
  );

  return route;
};
