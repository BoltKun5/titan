import { ICardCreateResponse } from './../../vokit_core/types/interface/api/responses/card.response';
import { CardType } from './../../database/models/card-type.model';
import { CardAdditionalPrinting } from './../../database/models/card-additional-printing.model';
import { HttpResponseError } from './../../modules/http-response-error';
import { User } from './../../database/models/user.model';
import {
  CardTypeEnum,
  ICardListResponse,
  ICardQuery,
  ICardUpdateResponse,
  IResponse,
  IStatsResponse,
  IUpsertCardBody,
} from 'vokit_core';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import cardService from '../../services/card.service';
import CardValidation from '../validations/card.validation';
import { Card, CardSet } from '../../database';

class CardController implements Controller {
  private static readonly logger = new LoggerModel(CardController.name);

  async getCardList(
    req: Request<Record<string, never>, ICardListResponse, void, ICardQuery>,
    res: Response<IResponse<ICardListResponse>, ILocals>,
  ): Promise<void> {
    req.query = CardValidation.cardQuery(req.query);

    let user;
    if (req.query?.userId) {
      user = await User.findOne({
        where: {
          id: req.query.userId,
        },
      });
      if (!user) {
        throw HttpResponseError.createNotFoundError();
      }
    } else {
      user = res.locals.currentUser;
    }

    if (!user) throw HttpResponseError.createNotFoundError();

    const cards = await cardService.getCards({ ...req.query }, user);
    const count = await cardService.getCount({ ...req.query }, user);

    const page = Number(req.query?.page) ?? 0;

    res.json({
      data: {
        cards,
        pagination: {
          total: count,
          page,
          totalPages: Math.ceil(count / 200),
          resultPerPage: 200,
        },
      },
    });
  }

  async getStats(
    req: Request<Record<string, never>, IStatsResponse, void, ICardQuery>,
    res: Response<IResponse<IStatsResponse>, ILocals>,
  ): Promise<void> {
    req.query = CardValidation.cardQuery(req.query);
    req.query.page = -1;

    // console.time('a');
    try {
      const stats = await cardService.getStats({ ...req.query }, res.locals.currentUser);
      if (!stats) {
        res.status(400);
        return;
      }
      res.json({ data: { stats } });
    } catch (e: any) {
      console.log(e.message);
    }
    // console.timeEnd('a');
  }

  async update(
    req: Request<Record<string, never>, ICardUpdateResponse, IUpsertCardBody>,
    res: Response<IResponse<ICardUpdateResponse>, ILocals>,
  ): Promise<void> {
    req.body = CardValidation.cardBody(req.body);

    const card = await Card.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: CardAdditionalPrinting,
          as: 'cardAdditionalPrinting',
          attributes: {
            exclude: ['cardId'],
          },
        },
        {
          model: CardType,
          as: 'types',
        },
        {
          model: CardSet,
          as: 'cardSet',
        },
      ],
    });

    if (!card) throw HttpResponseError.createNotFoundError();

    await card.update({
      name: req.body.name,
      rarity: req.body.rarity,
      canBeReverse: req.body.canBeReverse,
      localId: req.body.localId,
      setId: req.body.setId,
    });

    const addPrinting = card.cardAdditionalPrinting;
    const existingTypes = card.types.map((e) => e.type);

    await Promise.all(
      req.body.cardAdditionalPrinting.map((print): any => {
        if (!print?.id) {
          return CardAdditionalPrinting.create({
            creator: print.creator,
            cardId: card.id,
            type: print.type,
            name: print.name,
          });
        } else {
          return CardAdditionalPrinting.update(
            {
              creator: print.creator,
              cardId: card.id,
              type: print.type,
              name: print.name,
            },
            {
              where: {
                id: print.id,
              },
            },
          );
        }
      }),
    );

    await Promise.all(
      addPrinting.map((print) => {
        if (!req.body.cardAdditionalPrinting.find((e) => e.id === print.id)) {
          return CardAdditionalPrinting.destroy({
            where: {
              id: print.id,
            },
          });
        }
      }),
    );

    await Promise.all(
      Object.values(CardTypeEnum)
        .filter((e) => typeof e === 'number')
        .map((type: any): any => {
          if (existingTypes.includes(type) && !req.body.types.includes(type)) {
            return CardType.destroy({
              where: {
                cardId: card.id,
                type: type,
              },
            });
          }
          if (!existingTypes.includes(type) && req.body.types.includes(type)) {
            return CardType.create({
              cardId: card.id,
              type: type,
            });
          }
        }),
    );

    await card.reload();

    res.json({ data: { card } });
  }

  async create(
    req: Request<Record<string, never>, ICardCreateResponse, void>,
    res: Response<IResponse<ICardCreateResponse>, ILocals>,
  ): Promise<void> {
    const card = await Card.create();

    await card.update({
      setId: '00000000-0000-0000-0000-000000000000',
    });

    await card.reload();

    res.json({ data: { card } });
  }
}

export default new CardController();
