import { IncludeOptions } from 'sequelize/types';
import { CardSet } from './../../database/models/card-set.model';
import { CardAdditionalPrintingTypeEnum } from './../../../../../packages/core/src/enums/card-additional-printing.enum';
import { CardAdditionalPrinting } from './../../database/models/card-additional-printing.model';
import { UserCardPossession } from './../../database/models/user-card-possession.model';
import { Card } from './../../database/models/card';
import {
  CardRarityEnum,
  ICardListResponse,
  ICardQuery,
  IResponse,
  IStatsResponse,
  StatisticsDataType,
} from 'vokit_core';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import cardService from '../../services/card.service';
import CardValidation from '../validations/card.validation';

class CardController implements Controller {
  private static readonly logger = new LoggerModel(CardController.name);

  async getCardList(
    req: Request<Record<string, never>, ICardListResponse, void, ICardQuery>,
    res: Response<ICardListResponse, ILocals>,
  ): Promise<void> {
    req.query = CardValidation.cardQuery(req.query);

    const cards = await cardService.getCards({ ...req.query }, res.locals.currentUser);
    const count = await cardService.getCount({ ...req.query }, res.locals.currentUser);

    const page = Number(req.query?.page) ?? 0;

    res.json({
      cards,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / 200),
        resultPerPage: 200,
      },
    });
  }

  async getStats(
    req: Request<Record<string, never>, IStatsResponse, void, ICardQuery>,
    res: Response<IResponse<IStatsResponse>, ILocals>,
  ): Promise<void> {
    // console.time('a');
    // const cards = await cardService.getCards({ ...req.query }, res.locals.currentUser);
    // console.timeEnd('a');

    const filterOptions: IncludeOptions = cardService.getOptions(
      req.query,
      res.locals.currentUser,
    ) as IncludeOptions;

    try {
      const rarityCount: any = await Card.count({
        attributes: ['rarity'],
        group: ['rarity'],
        ...cardService.getOptions(req.query, res.locals.currentUser),
      });

      const totalRarityCount: any = await UserCardPossession.count({
        attributes: ['card.rarity'],
        group: ['card.rarity'],
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
        ],
      });

      const distinctRarityCount: any = await UserCardPossession.count({
        attributes: ['card.rarity'],
        group: ['card.rarity'],
        distinct: true,
        col: 'cardId',
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
        ],
      });

      const totalSetCount: any = await UserCardPossession.count({
        attributes: ['card.setId'],
        group: ['card.setId'],
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
        ],
      });

      const distinctOwned = (
        await UserCardPossession.count({
          group: ['cardId'],
          include: [
            {
              model: Card,
              as: 'card',
              required: true,
              ...filterOptions,
            },
          ],
        })
      ).length;

      const distinctNormal = (
        await UserCardPossession.count({
          where: {
            printingId: null,
          },
          group: ['cardId'],
          include: [
            {
              model: Card,
              as: 'card',
              required: true,
              ...filterOptions,
            },
          ],
        })
      ).length;

      const distinctNormalPossible = await Card.count({
        ...cardService.getOptions(req.query, res.locals.currentUser),
      });

      const distinctReverse = (
        await UserCardPossession.count({
          include: [
            {
              model: CardAdditionalPrinting,
              as: 'printing',
              required: true,
              where: {
                type: CardAdditionalPrintingTypeEnum.REVERSE,
              },
            },
            {
              model: Card,
              as: 'card',
              required: true,
              ...filterOptions,
            },
          ],
          group: ['UserCardPossession.cardId'],
        })
      ).length;

      const distinctReversePossible = await Card.count({
        ...cardService.getOptions(req.query, res.locals.currentUser),
        include: [
          {
            model: CardAdditionalPrinting,
            as: 'cardAdditionalPrinting',
            required: true,
            where: {
              type: CardAdditionalPrintingTypeEnum.REVERSE,
            },
          },
        ],
      });

      const totalOwned = await UserCardPossession.count({
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
        ],
      });

      const totalNormal = await UserCardPossession.count({
        where: {
          printingId: null,
        },
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
        ],
      });

      const totalReverse = await UserCardPossession.count({
        include: [
          {
            model: CardAdditionalPrinting,
            as: 'printing',
            required: true,
            where: {
              type: CardAdditionalPrintingTypeEnum.REVERSE,
            },
          },
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
        ],
      });

      const countByRarity: any = {
        Common: 1,
        Uncommon: 2,
        Rare: 3,
        Holo: 4,
        'Ultra Rare': 5,
        'Secret Rare': 6,
        Amazing: 7,
        None: 8,
      };

      const distinctCountBySet: any = await Card.count({
        ...cardService.getOptions(req.query, res.locals.currentUser),
        include: [
          {
            model: CardAdditionalPrinting,
            as: 'cardAdditionalPrinting',
          },
        ],
        group: ['cardAdditionalPrinting.type', 'Card.setId'],
      });

      Object.values(CardRarityEnum)
        .sort((a, b) => countByRarity[a] - countByRarity[b])
        .map((el: any) => {
          if (typeof el !== 'number') {
            countByRarity[el] = {
              totalOwned:
                totalRarityCount.find((e: any) => e.rarity === CardRarityEnum[el])?.count ?? 0,
              distinctOwned:
                distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum[el])?.count ?? 0,
              distinctPossible:
                rarityCount.find((e: any) => e.rarity === CardRarityEnum[el])?.count ?? 0,
            };
          }
        });

      const totalCountBySet = await UserCardPossession.count({
        attributes: ['card.setId'],
        group: ['card.setId', 'printing.type'],
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
          {
            model: CardAdditionalPrinting,
            as: 'printing',
          },
        ],
      });

      const distinctOwnedCountBySet = await UserCardPossession.count({
        attributes: ['card.setId'],
        group: ['card.setId', 'printing.type'],
        distinct: true,
        col: 'cardId',
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
          },
          {
            model: CardAdditionalPrinting,
            as: 'printing',
          },
        ],
      });

      const countBySet: any = {};

      await Promise.all(
        totalSetCount.map(
          (el: { setId: string; count: number }) =>
            new Promise(async (resolve) => {
              const set = await CardSet.findOne({ where: { id: el.setId } });
              if (!set) return;
              countBySet[set.code] = {
                totalNormal:
                  totalCountBySet.find((e: any) => e.setId === el.setId && e.type === null)
                    ?.count ?? 0,

                totalReverse:
                  totalCountBySet.find(
                    (e: any) =>
                      e.setId === el.setId && e.type === CardAdditionalPrintingTypeEnum.REVERSE,
                  )?.count ?? 0,

                totalOwned: totalSetCount.find((e: any) => e.setId === el.setId)?.count ?? 0,

                distinctNormal:
                  distinctOwnedCountBySet.find((e: any) => e.setId === el.setId && e.type === null)
                    ?.count ?? 0,

                distinctReverse:
                  distinctOwnedCountBySet.find(
                    (e: any) =>
                      e.setId === el.setId && e.type === CardAdditionalPrintingTypeEnum.REVERSE,
                  )?.count ?? 0,

                distinctPossibleNormal: distinctCountBySet
                  .filter((e: any) => e.setId === el.setId)
                  .reduce((part: any, a: any) => part + a.count, 0),

                distinctPossibleReverse:
                  distinctCountBySet.find(
                    (e: any) =>
                      e.setId === el.setId && e.type === CardAdditionalPrintingTypeEnum.REVERSE,
                  )?.count ?? 0,

                distinctOwned:
                  (distinctOwnedCountBySet.find((e: any) => e.setId === el.setId && e.type === null)
                    ?.count ?? 0) +
                  (distinctOwnedCountBySet.find(
                    (e: any) =>
                      e.setId === el.setId && e.type === CardAdditionalPrintingTypeEnum.REVERSE,
                  )?.count ?? 0),

                distinctPossible:
                  (distinctCountBySet.find(
                    (e: any) =>
                      e.setId === el.setId && e.type === CardAdditionalPrintingTypeEnum.REVERSE,
                  )?.count ?? 0) +
                  distinctCountBySet
                    .filter((e: any) => e.setId === el.setId)
                    .reduce((part: any, a: any) => part + a.count, 0),
              };
              resolve(null);
            }),
        ),
      ).catch((e) => console.log(e));

      const stats: StatisticsDataType = {
        distinctPossible: distinctNormalPossible + distinctReversePossible,
        distinctOwned,
        distinctNormal,
        distinctNormalPossible,
        distinctReverse,
        distinctReversePossible,

        totalOwned,
        totalNormal,
        totalReverse,

        countByRarity,
        countBySet,
      };

      res.json({ data: { stats } });
    } catch (e: any) {
      console.log(e);
    }
  }
}

export default new CardController();
