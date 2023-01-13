import { IUserCardPossession } from './../../../../local-core/types/models/user-card-possession.dto';
import {
  ICreateTagBody,
  ICreateTagResponse,
  ISetQuantityBody,
  ISetQuantityResponse,
  ISimpleDeletePossessionBody,
  ISimpleDeletePossessionResponse,
  IUserTagsBody,
  IUserTagsResponse,
} from './../../../../local-core/interface/api/api.interface';
import {
  ICreatePossessionBody,
  ICreatePossessionResponse,
  ICreateMultiplePossessionBody,
  ICreateMultiplePossessionResponse,
  IUpdatePossessionBody,
  IUpdatePossessionResponse,
  IDeletePossessionResponse,
  IDeletePossessionBody,
} from '../../../../local-core';
import { IResponseLocals } from '../../../../local-core';
import { IResponse } from '../../../../local-core';
import { Request, Response, Router } from 'express';
import Auth from '../middlewares/auth';
import { UserCardPossession } from '../../database/models/user-card-possession.model';
import { v4 } from 'uuid';
import { CardAdditionalPrinting } from '../../database/models/card-additional-printing.model';
import { Tag } from '../../database/models/tag.model';
import { CardTag } from '../../database/models/card-tag.model';

const route = Router();

export const UserCardsRouter = (app: Router): Router => {
  app.use('/usercards', route);

  route.post(
    '/update',
    Auth,
    async (
      req: Request<any, any, IUpdatePossessionBody>,
      res: Response<IResponse<IUpdatePossessionResponse>, IResponseLocals>,
    ) => {
      try {
        await UserCardPossession.bulkCreate(req.body.possessions as UserCardPossession[], {
          updateOnDuplicate: ['condition', 'grade', 'printingId'],
        });

        if (req.body?.createdTags && req.body.createdTags.length > 0)
          await CardTag.bulkCreate(req.body?.createdTags ?? []);
        if (req.body?.deletedTags && req.body.deletedTags.length > 0) {
          for (const deleteEl of req.body.deletedTags) {
            await CardTag.destroy({
              where: {
                cardPossessionId: deleteEl.cardPossessionId,
                tagId: deleteEl.tagId,
              },
            });
          }
        }
      } catch (e) {
        console.log(e);
      }

      const newPossessions = await UserCardPossession.findAll({
        order: [['createdAt', 'ASC']],
        where: {
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
        },
        include: [
          { model: CardAdditionalPrinting, as: 'printing' },
          { model: Tag, as: 'tags' },
        ],
      });
      res.json({ data: { possessions: newPossessions } });
    },
  );

  route.post(
    '/createPossession',
    Auth,
    async (
      req: Request<
        Record<string, never>,
        IResponse<ICreatePossessionResponse>,
        ICreatePossessionBody
      >,
      res: Response<IResponse<ICreatePossessionResponse>, IResponseLocals>,
    ) => {
      let possession = (await UserCardPossession.create({
        cardId: req.body.cardId,
        userId: res.locals.currentUser.id,
        printingId: req.body?.cardPrintingId ?? null,
      })) as unknown as IUserCardPossession;

      possession = (await UserCardPossession.findOne({
        where: {
          id: possession.id,
        },
        include: [
          { model: CardAdditionalPrinting, as: 'printing' },
          { model: Tag, as: 'tags' },
        ],
      })) as unknown as IUserCardPossession;

      res.json({ data: { code: 'CARD_CREATED', possession } });
    },
  );

  route.post(
    '/simpleDeletePossession',
    Auth,
    async (
      req: Request<
        Record<string, never>,
        IResponse<ISimpleDeletePossessionResponse>,
        ISimpleDeletePossessionBody
      >,
      res: Response<IResponse<ISimpleDeletePossessionResponse>, IResponseLocals>,
    ) => {
      const result = await UserCardPossession.findAll({
        where: {
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
          printingId: req.body?.cardPrintingId ?? null,
          deletionType: null,
        },
      });

      let deletedId = undefined;

      for (const possession of result) {
        if (
          possession.condition === null &&
          possession.grade === null &&
          possession.note === null
        ) {
          deletedId = possession.id;
          await possession.destroy();
          break;
        }
      }

      if (!deletedId) {
        res.json({ data: { code: 'NO_EMPTY_POSSESSION' } });
      } else {
        res.json({ data: { code: 'CARD_DELETED', deletedId } });
      }
    },
  );

  route.post(
    '/forceDeletePossession',
    Auth,
    async (
      req: Request<
        Record<string, never>,
        IResponse<IDeletePossessionResponse>,
        IDeletePossessionBody
      >,
      res: Response<IResponse<IDeletePossessionResponse>, IResponseLocals>,
    ) => {
      try {
        // TODO: mettre le cascade du onDelete quand ça fonctionnera (sequelize 7 on espère)
        const response = await UserCardPossession.findOne({
          where: {
            id: req.body.possessionId,
            userId: res.locals.currentUser.id,
          },
        });

        if (response) {
          await CardTag.destroy({
            where: {
              cardPossessionId: response.id,
            },
          });

          await response.destroy();
          res.json({ data: { code: 'CARD_DELETED' } });
        }
      } catch (e) {
        console.log(e);
        throw new Error('UNDEFINED');
      }
    },
  );

  route.post(
    '/multiple-possession',
    Auth,
    async (
      req: Request<
        Record<string, never>,
        IResponse<ICreateMultiplePossessionResponse>,
        ICreateMultiplePossessionBody
      >,
      res: Response<IResponse<ICreateMultiplePossessionResponse>, IResponseLocals>,
    ) => {
      try {
        const boosterId = v4();
        const data = req.body.cards.map((card) => {
          card.boosterId = boosterId;
          card.userId = res.locals.currentUser.id;
          return card;
        });
        const results = await UserCardPossession.bulkCreate(data);

        res.json({ data: { result: results } });
      } catch (e) {
        throw new Error('UNDEFINED');
        console.log(e);
      }
    },
  );

  route.post(
    '/setQuantity',
    Auth,
    async (
      req: Request<Record<string, never>, IResponse<ISetQuantityResponse>, ISetQuantityBody>,
      res: Response<IResponse<ISetQuantityResponse>, IResponseLocals>,
    ) => {
      const result = await UserCardPossession.findAll({
        where: {
          cardId: req.body.cardId,
          userId: res.locals.currentUser.id,
          printingId: req.body?.cardPrintingId ?? null,
          deletionType: null,
        },
      });
      const diff = req.body.quantity - result.length;
      if (diff === 0) {
        return res.json({ data: { code: 'NO_CHANGE' } });
      }
      if (diff < 0) {
        const deletedId = [];
        let count = 0;
        for (const possession of result) {
          if (
            possession.condition === null &&
            possession.grade === null &&
            possession.note === null
          ) {
            deletedId.push(possession.id);
            await possession.destroy();
            count++;
            if (count === diff * -1) {
              return res.json({ data: { code: 'CARDS_DELETED', result: deletedId } });
              break;
            }
          }
        }
        return res.json({ data: { code: 'NOT_ENOUGH_DELETABLE', result: deletedId } });
      }
      if (diff > 0) {
        const createdCards = [];
        for (let i = 0; i < diff; i++) {
          const create = await UserCardPossession.create({
            cardId: req.body.cardId,
            userId: res.locals.currentUser.id,
            printingId: req.body.cardPrintingId,
          });

          const result = await UserCardPossession.findOne({
            where: {
              id: create.id,
            },
            include: [{ model: CardAdditionalPrinting, as: 'printing' }],
          });
          if (result) createdCards.push(result);
        }
        res.json({ data: { code: 'CARDS_CREATED', result: createdCards } });
      }
    },
  );

  route.get(
    '/tags',
    Auth,
    async (
      req: Request<any, any, IUserTagsBody>,
      res: Response<IResponse<IUserTagsResponse>, IResponseLocals>,
    ) => {
      const result = await Tag.findAll({
        where: {
          userId: res.locals.currentUser.id,
        },
      });
      res.json({ data: { tags: result } });
    },
  );

  route.post(
    '/tags',
    Auth,
    async (
      req: Request<any, any, ICreateTagBody>,
      res: Response<IResponse<ICreateTagResponse>, IResponseLocals>,
    ) => {
      await Tag.create({
        userId: res.locals.currentUser.id,
        name: req.body.name,
        type: 0,
      });
      const allTags = await Tag.findAll({
        where: {
          userId: res.locals.currentUser.id,
        },
      });
      res.json({ data: { tags: allTags } });
    },
  );

  // route.get(
  //   '/historic',
  //   Auth,
  //   async (
  //     req: Request<any, any, IHistoricQuery>,
  //     res: Response<IResponse<IHistoricResponse>, IResponseLocals>,
  //   ) => {
  //     const result = await CardPossessionHistoric.findAll({
  //       order: [['createdAt', 'DESC']],
  //       include: [
  //         {
  //           where: {
  //             userId: req.query.userId,
  //           },
  //           model: UserCardPossession,
  //           required: true,
  //           duplicating: false,
  //           attributes: {
  //             exclude: [
  //               'cardId',
  //               'classicQuantity',
  //               'createdAt',
  //               'reverseQuantity',
  //               'updatedAt',
  //               'userId',
  //             ],
  //           },
  //           include: [
  //             {
  //               model: Card,
  //               duplicating: false,
  //               as: 'card',
  //               attributes: {
  //                 exclude: getCardAttributesExcludeArray(['localId', 'name']),
  //               },
  //               include: [
  //                 {
  //                   model: CardSet,
  //                   duplicating: false,
  //                   as: 'cardSet',
  //                   attributes: {
  //                     exclude: [
  //                       'cardCount',
  //                       'cardSerieId',
  //                       'isPlayableInExpanded',
  //                       'isPlayableInStandard',
  //                       'releaseDate',
  //                       'tcgOnline',
  //                     ],
  //                   },
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //     res.json({ data: { result } });
  //   },
  // );

  // route.get(
  //   '/boosters',
  //   Auth,
  //   async (
  //     req: Request<any, any, IHistoricQuery>,
  //     res: Response<IResponse<any>, IResponseLocals>,
  //   ) => {
  //     const result = await CardPossessionHistoric.findAll({
  //       order: [['createdAt', 'DESC']],
  //       include: [
  //         {
  //           where: {
  //             userId: req.query.userId,
  //           },
  //           model: UserCardPossession,
  //           required: true,
  //           duplicating: false,
  //           attributes: {
  //             exclude: [
  //               'cardId',
  //               'classicQuantity',
  //               'createdAt',
  //               'reverseQuantity',
  //               'updatedAt',
  //               'userId',
  //             ],
  //           },
  //           include: [
  //             {
  //               model: Card,
  //               duplicating: false,
  //               as: 'card',
  //               attributes: {
  //                 exclude: getCardAttributesExcludeArray(['localId', 'name']),
  //               },
  //               include: [
  //                 {
  //                   model: CardSet,
  //                   duplicating: false,
  //                   as: 'cardSet',
  //                   attributes: {
  //                     exclude: [
  //                       'cardCount',
  //                       'cardSerieId',
  //                       'isPlayableInExpanded',
  //                       'isPlayableInStandard',
  //                       'releaseDate',
  //                       'tcgOnline',
  //                     ],
  //                   },
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //       where: {
  //         boosterId: {
  //           [Op.ne]: null,
  //         },
  //       },
  //     });

  //     const filteredBoosters = [];

  //     result.forEach((el) => {
  //       let boosterElement: any = filteredBoosters.find((booster) => booster.id === el.boosterId);

  //       if (!boosterElement) {
  //         filteredBoosters.push({
  //           createdAt: el.createdAt,
  //           cardSet: el.cardPossession.card.cardSet,
  //           id: el.boosterId,
  //           cards: [],
  //         });
  //         boosterElement = filteredBoosters.find((booster) => booster.id === el.boosterId);
  //       }

  //       boosterElement.cards.push({
  //         id: el.cardPossession.card.id,
  //         localId: el.cardPossession.card.localId,
  //         name: el.cardPossession.card.name,
  //         type: el.oldClassicQuantity < el.newClassicQuantity ? 'classic' : 'reverse',
  //       });
  //     });

  //     res.json({ data: filteredBoosters });
  //   },
  // );

  return route;
};
