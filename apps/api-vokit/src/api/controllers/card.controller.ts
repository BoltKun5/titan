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
import sequelize from 'sequelize';

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

    try {
      const rarityCount: any = await Card.count({
        attributes: ['rarity'],
        group: ['rarity'],
      });

      const totalRarityCount: any = await UserCardPossession.count({
        attributes: ['card.rarity'],
        group: ['card.rarity'],
        include: [
          {
            model: Card,
            as: 'card',
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
            attributes: [],
          },
        ],
      });

      const distinctPossible = await Card.count(
        cardService.getOptions(req.query, res.locals.currentUser),
      );

      const distinctOwned = (
        await UserCardPossession.count({
          group: ['cardId'],
        })
      ).length;

      const distinctNormal = (
        await UserCardPossession.count({
          where: {
            printingId: null,
          },
          group: ['cardId'],
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

      const totalOwned = await UserCardPossession.count();

      const totalNormal = await UserCardPossession.count({
        where: {
          printingId: null,
        },
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
        ],
      });

      const stats: StatisticsDataType = {
        distinctPossible,
        distinctOwned,
        distinctNormal,
        distinctNormalPossible,
        distinctReverse,
        distinctReversePossible,

        totalOwned,
        totalNormal,
        totalReverse,

        countByRarity: {
          Common: {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum.Common)?.count ?? 0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum.Common)?.count ?? 0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum.Common)?.count ?? 0,
          },
          Uncommon: {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum.Uncommon)?.count ?? 0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum.Uncommon)?.count ??
              0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum.Uncommon)?.count ?? 0,
          },
          Rare: {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum.Rare)?.count ?? 0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum.Rare)?.count ?? 0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum.Rare)?.count ?? 0,
          },
          Holo: {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum.Holo)?.count ?? 0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum.Holo)?.count ?? 0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum.Holo)?.count ?? 0,
          },
          'Ultra Rare': {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum['Ultra Rare'])?.count ??
              0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum['Ultra Rare'])
                ?.count ?? 0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum['Ultra Rare'])?.count ?? 0,
          },
          'Secret Rare': {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum['Secret Rare'])
                ?.count ?? 0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum['Secret Rare'])
                ?.count ?? 0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum['Secret Rare'])?.count ?? 0,
          },
          None: {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum.None)?.count ?? 0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum.None)?.count ?? 0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum.None)?.count ?? 0,
          },
          Amazing: {
            totalOwned:
              totalRarityCount.find((e: any) => e.rarity === CardRarityEnum.Amazing)?.count ?? 0,
            distinctOwned:
              distinctRarityCount.find((e: any) => e.rarity === CardRarityEnum.Amazing)?.count ?? 0,
            distinctPossible:
              rarityCount.find((e: any) => e.rarity === CardRarityEnum.Amazing)?.count ?? 0,
          },
        },
        countBySet: {},
      };

      res.json({ data: { stats } });
    } catch (e: any) {
      console.log(e);
    }
  }
}

export default new CardController();
