import { HttpResponseError } from './../modules/http-response-error';
import {
  ICreateMultiplePossessionBody,
  ICreatePossessionBody,
  IDeletePossessionBody,
  ISetQuantityBody,
  ISimpleDeletePossessionBody,
  IUpdatePossessionBody,
  IUser,
  IUserCardPossession,
} from 'vokit_core';
import { UserCardPossession } from './../database/models/user-card-possession.model';
import { EntityService } from '../core';
import { CardAdditionalPrinting } from '../database/models/card-additional-printing.model';
import { CardTag } from '../database/models/card-tag.model';
import { Tag } from '../database/models/tag.model';
import { v4 } from 'uuid';

export class UserCardPossessionService extends EntityService<
  UserCardPossession,
  IUserCardPossession
> {
  public async updatePossession(
    options: IUpdatePossessionBody,
    user: IUser,
  ): Promise<UserCardPossession[]> {
    const values = options.possessions.map((option) => {
      option.userId = user.id;
      return option;
    });
    await UserCardPossession.bulkCreate(values, {
      updateOnDuplicate: ['condition', 'grade', 'printingId'],
    });

    if (options?.createdTags && options.createdTags.length > 0)
      await CardTag.bulkCreate(options?.createdTags ?? []);
    if (options?.deletedTags && options.deletedTags.length > 0) {
      for (const deleteEl of options.deletedTags) {
        await CardTag.destroy({
          where: {
            cardPossessionId: deleteEl.cardPossessionId,
            tagId: deleteEl.tagId,
          },
        });
      }
    }

    const newPossessions = await UserCardPossession.findAll({
      order: [['createdAt', 'ASC']],
      where: {
        cardId: options.cardId,
        userId: user.id,
      },
      include: [
        { model: CardAdditionalPrinting, as: 'printing' },
        { model: Tag, as: 'tags' },
      ],
    });

    return newPossessions;
  }

  public async createPossession(
    options: ICreatePossessionBody,
    user: IUser,
  ): Promise<UserCardPossession> {
    const possession = await UserCardPossession.create({
      cardId: options.cardId,
      userId: user.id,
      printingId: options?.cardPrintingId ?? null,
    });

    const newPossession = await UserCardPossession.findOne({
      where: {
        id: possession.id,
      },
      include: [
        { model: CardAdditionalPrinting, as: 'printing' },
        { model: Tag, as: 'tags' },
      ],
    });

    if (!newPossession) {
      throw HttpResponseError.createInternalServerError();
    }

    return newPossession;
  }

  public async simpleDelete(
    options: ISimpleDeletePossessionBody,
    user: IUser,
  ): Promise<string | null> {
    const result = await UserCardPossession.findAll({
      where: {
        cardId: options.cardId,
        userId: user.id,
        printingId: options?.cardPrintingId ?? null,
        deletionType: null,
      },
    });

    let deletedId = null;

    for (const possession of result) {
      if (possession.condition === null && possession.grade === null && possession.note === null) {
        deletedId = possession.id;
        // await possession.destroy();
        console.log(possession);
        break;
      }
    }

    if (!deletedId) {
      throw HttpResponseError.createNotEnoughDeletablePossession();
    }

    return deletedId;
  }

  public async forceDelete(options: IDeletePossessionBody, user: IUser): Promise<string | null> {
    // TODO: mettre le cascade du onDelete quand ça fonctionnera (sequelize 7 on espère)
    const response = await UserCardPossession.findOne({
      where: {
        id: options.possessionId,
        userId: user.id,
      },
    });

    if (response) {
      await CardTag.destroy({
        where: {
          cardPossessionId: response.id,
        },
      });

      await response.destroy();
      return response.id;
    }
    return null;
  }

  public async createWithBoosterId(
    options: ICreateMultiplePossessionBody,
    user: IUser,
  ): Promise<UserCardPossession[]> {
    const boosterId = v4();
    const data = options.cards.map((card) => {
      const _card: { boosterId: string; userId: string; cardId: string; printingId: string } = {
        ...card,
        boosterId: '',
        userId: '',
      };
      _card.boosterId = boosterId;
      _card.userId = user.id;
      return _card;
    });
    return UserCardPossession.bulkCreate(data);
  }

  public async setQuantity(
    options: ISetQuantityBody,
    user: IUser,
  ): Promise<{ code: string; result?: UserCardPossession[] | string[] }> {
    const result = await UserCardPossession.findAll({
      where: {
        cardId: options.cardId,
        userId: user.id,
        printingId: options?.cardPrintingId ?? null,
        deletionType: null,
      },
    });
    const diff = options.quantity - result.length;
    if (diff === 0) {
      return { code: 'NO_CHANGE' };
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
            return { code: 'CARDS_DELETED', result: deletedId };
          }
        }
      }
      return { code: 'NOT_ENOUGH_DELETABLE', result: deletedId };
    } else {
      const createdCards = [];
      for (let i = 0; i < diff; i++) {
        const create = await UserCardPossession.create({
          cardId: options.cardId,
          userId: user.id,
          printingId: options.cardPrintingId,
        });

        const result = await UserCardPossession.findOne({
          where: {
            id: create.id,
          },
          include: [{ model: CardAdditionalPrinting, as: 'printing' }],
        });
        if (result) createdCards.push(result);
      }
      return { code: 'CARDS_CREATED', result: createdCards };
    }
  }
}

export default new UserCardPossessionService();
