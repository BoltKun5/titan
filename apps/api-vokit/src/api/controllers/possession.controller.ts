import { HttpResponseError } from './../../modules/http-response-error';
import { Controller, LoggerModel, ILocals } from '../../core';
import { Request, Response } from 'express';
import {
  ICreateMultiplePossessionBody,
  ICreateMultiplePossessionResponse,
  ICreatePossessionBody,
  ICreatePossessionResponse,
  IDeletePossessionBody,
  IDeletePossessionResponse,
  IHistoricQuery,
  IHistoricResponse,
  IResponse,
  ISetQuantityBody,
  ISetQuantityResponse,
  ISimpleDeletePossessionBody,
  ISimpleDeletePossessionResponse,
  IUpdatePossessionBody,
  IUpdatePossessionResponse,
} from 'vokit_core';
import userCardPossessionService from '../../services/user-card-possession.service';
import PossessionValidation from '../validations/possession.validation';

class PossessionController implements Controller {
  private static readonly logger = new LoggerModel(PossessionController.name);

  async update(
    req: Request<
      Record<string, never>,
      IResponse<IUpdatePossessionResponse>,
      IUpdatePossessionBody
    >,
    res: Response<IResponse<IUpdatePossessionResponse>, ILocals>,
  ): Promise<void> {
    req.body = PossessionValidation.update(req.body);
    const newPossessions = await userCardPossessionService.updatePossession(
      { ...req.body },
      res.locals.currentUser,
    );

    res.json({ data: { possessions: newPossessions } });
  }

  async create(
    req: Request<
      Record<string, never>,
      IResponse<ICreatePossessionResponse>,
      ICreatePossessionBody
    >,
    res: Response<IResponse<ICreatePossessionResponse>, ILocals>,
  ): Promise<void> {
    req.body = PossessionValidation.create(req.body);
    const newPossession = await userCardPossessionService.createPossession(
      { ...req.body },
      res.locals.currentUser,
    );

    res.json({ data: { possession: newPossession } });
  }

  async simpleDelete(
    req: Request<
      Record<string, never>,
      IResponse<ISimpleDeletePossessionResponse>,
      ISimpleDeletePossessionBody
    >,
    res: Response<IResponse<ISimpleDeletePossessionResponse>, ILocals>,
  ): Promise<void> {
    req.body = PossessionValidation.simpleDelete(req.body);
    const deletedId = await userCardPossessionService.simpleDelete(
      { ...req.body },
      res.locals.currentUser,
    );

    if (!deletedId) {
      throw HttpResponseError.createNotEnoughDeletablePossession();
    } else {
      res.json({ data: { deletedId } });
    }
  }

  async forceDelete(
    req: Request<
      Record<string, never>,
      IResponse<IDeletePossessionResponse>,
      IDeletePossessionBody
    >,
    res: Response<IResponse<IDeletePossessionResponse>, ILocals>,
  ): Promise<void> {
    req.body = PossessionValidation.forceDelete(req.body);
    const deletedId = await userCardPossessionService.forceDelete(
      { ...req.body },
      res.locals.currentUser,
    );

    if (!deletedId) {
      throw HttpResponseError.createNotFoundError();
    }
    res.json({ data: { deletedId } });
  }

  async multipleCreate(
    req: Request<
      Record<string, never>,
      IResponse<ICreateMultiplePossessionResponse>,
      ICreateMultiplePossessionBody
    >,
    res: Response<IResponse<ICreateMultiplePossessionResponse>, ILocals>,
  ): Promise<void> {
    req.body = PossessionValidation.multipleCreate(req.body);
    const results = await userCardPossessionService.createWithBoosterId(
      { ...req.body },
      res.locals.currentUser,
    );

    res.json({ data: { result: results } });
  }

  async setQuantity(
    req: Request<Record<string, never>, IResponse<ISetQuantityResponse>, ISetQuantityBody>,
    res: Response<IResponse<ISetQuantityResponse>, ILocals>,
  ): Promise<void> {
    req.body = PossessionValidation.setQuantity(req.body);
    const data = await userCardPossessionService.setQuantity(
      { ...req.body },
      res.locals.currentUser,
    );

    res.json({ data });
  }

  async getHistoric(
    req: Request<any, any, IHistoricQuery>,
    res: Response<IResponse<IHistoricResponse>, ILocals>,
  ): Promise<void> {
    console.log(req, res);
    // const result = await CardPossessionHistoric.findAll({
    //   order: [['createdAt', 'DESC']],
    //   include: [
    //     {
    //       where: {
    //         userId: req.query.userId,
    //       },
    //       model: UserCardPossession,
    //       required: true,
    //       duplicating: false,
    //       attributes: {
    //         exclude: [
    //           'cardId',
    //           'classicQuantity',
    //           'createdAt',
    //           'reverseQuantity',
    //           'updatedAt',
    //           'userId',
    //         ],
    //       },
    //       include: [
    //         {
    //           model: Card,
    //           duplicating: false,
    //           as: 'card',
    //           attributes: {
    //             exclude: getCardAttributesExcludeArray(['localId', 'name']),
    //           },
    //           include: [
    //             {
    //               model: CardSet,
    //               duplicating: false,
    //               as: 'cardSet',
    //               attributes: {
    //                 exclude: [
    //                   'cardCount',
    //                   'cardSerieId',
    //                   'isPlayableInExpanded',
    //                   'isPlayableInStandard',
    //                   'releaseDate',
    //                   'tcgOnline',
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // });
    // res.json({ data: { result } });
  }

  async getBoosters(
    req: Request<any, any, IHistoricQuery>,
    res: Response<IResponse<any>, ILocals>,
  ): Promise<void> {
    console.log(req, res);
    // const result = await CardPossessionHistoric.findAll({
    //   order: [['createdAt', 'DESC']],
    //   include: [
    //     {
    //       where: {
    //         userId: req.query.userId,
    //       },
    //       model: UserCardPossession,
    //       required: true,
    //       duplicating: false,
    //       attributes: {
    //         exclude: [
    //           'cardId',
    //           'classicQuantity',
    //           'createdAt',
    //           'reverseQuantity',
    //           'updatedAt',
    //           'userId',
    //         ],
    //       },
    //       include: [
    //         {
    //           model: Card,
    //           duplicating: false,
    //           as: 'card',
    //           attributes: {
    //             exclude: getCardAttributesExcludeArray(['localId', 'name']),
    //           },
    //           include: [
    //             {
    //               model: CardSet,
    //               duplicating: false,
    //               as: 'cardSet',
    //               attributes: {
    //                 exclude: [
    //                   'cardCount',
    //                   'cardSerieId',
    //                   'isPlayableInExpanded',
    //                   'isPlayableInStandard',
    //                   'releaseDate',
    //                   'tcgOnline',
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    //   where: {
    //     boosterId: {
    //       [Op.ne]: null,
    //     },
    //   },
    // });
    // const filteredBoosters = [];
    // result.forEach((el) => {
    //   let boosterElement: any = filteredBoosters.find((booster) => booster.id === el.boosterId);
    //   if (!boosterElement) {
    //     filteredBoosters.push({
    //       createdAt: el.createdAt,
    //       cardSet: el.cardPossession.card.cardSet,
    //       id: el.boosterId,
    //       cards: [],
    //     });
    //     boosterElement = filteredBoosters.find((booster) => booster.id === el.boosterId);
    //   }
    //   boosterElement.cards.push({
    //     id: el.cardPossession.card.id,
    //     localId: el.cardPossession.card.localId,
    //     name: el.cardPossession.card.name,
    //     type: el.oldClassicQuantity < el.newClassicQuantity ? 'classic' : 'reverse',
    //   });
    // });
    // res.json({ data: filteredBoosters });
  }
}

export default new PossessionController();
