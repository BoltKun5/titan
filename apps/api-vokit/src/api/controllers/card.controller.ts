import { HttpResponseError } from './../../modules/http-response-error';
import { User } from './../../database/models/user.model';
import { ICardListResponse, ICardQuery, IResponse, IStatsResponse } from 'vokit_core';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import cardService from '../../services/card.service';
import CardValidation from '../validations/card.validation';

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
}

export default new CardController();
