import { ICardQuery } from './../../../../packages/core/src/types/interface/api/requests/card.request';
import { FindOptions, Includeable, IncludeOptions } from 'sequelize/types';
import { Op } from 'sequelize';
import { ICard, IUser } from 'vokit_core';
import { Card, CardSet, CardType, User, UserCardPossession } from '../database';
import { EntityService, Paginator } from '../core';
import { CardAdditionalPrinting } from '../database/models/card-additional-printing.model';
import { Tag } from '../database/models/tag.model';

export class CardService extends EntityService<Card, ICard> {
  private readonly paginator = new Paginator(User);

  private resultPerPage = 200;

  public async getCards(params: ICardQuery, user: IUser): Promise<ICard[]> {
    return await Card.findAll(this.getOptions(params, user));
  }

  public async getCount(params: ICardQuery, user: IUser): Promise<number> {
    return await Card.count(this.getOptions(params, user));
  }

  public getOptions(params: ICardQuery, user: IUser): FindOptions | IncludeOptions {
    return {
      where: {
        name: {
          [Op.iLike]: `%${params?.namefilter ?? ''}%`,
        },
        ...(params?.rarity && {
          rarity: {
            [Op.in]: params.rarity,
          },
        }),
      },
      ...this.getOrder(params.order),
      ...this.getCardAttributeList(params),
      include: [...this.getIncludeArray(params, user)] as Includeable[] | undefined,
      ...this.getPagination(params),
      subQuery: false,
    };
  }

  public getOrder(order: 'default' | 'name' | 'type' | undefined): any {
    let mainOrder;
    if (!order) return {};
    if (order) {
      switch (order) {
        case 'default':
          mainOrder = [
            [{ model: CardSet, as: 'cardSet' }, 'releaseDate', 'desc'],
            ['localId', 'asc'],
          ];
          break;
        case 'name':
          mainOrder = [['name', 'asc']];
          break;
        case 'type':
          mainOrder = [[{ model: CardType, as: 'types' }, 'type', 'asc']];
      }
    }
    return { order: mainOrder };
  }

  public getCardAttributeList(params: ICardQuery): any {
    let attributeList;
    const page = Number(params?.page ?? 0);
    if (page !== -1) {
      attributeList = { attributes: { exclude: ['cardSet'] } };
    } else {
      attributeList = {};
    }
    return attributeList;
  }

  public getPagination(params: ICardQuery): any {
    const pagination: any = {};
    const page = Number(params?.page ?? 0);
    if (page !== -1) {
      pagination.limit = this.resultPerPage;
    }
    if (page > 0) {
      pagination.offset = (page - 1) * this.resultPerPage;
    }

    return pagination;
  }

  public getIncludeArray(params: ICardQuery, user: IUser): any[] {
    let array: any[] = [];
    if (!params.stats) {
      array = [
        {
          model: CardAdditionalPrinting,
          as: 'cardAdditionalPrinting',
          required: false,
          duplicating: false,
        },
        {
          model: UserCardPossession,
          as: 'userCardPossessions',
          required: params?.possession === 'owned' ?? false,
          duplicating: false,
          order: [['createdAt', 'ASC']],
          separate: true,
          where: {
            userId: user.id,
          },
          include: [
            {
              model: CardAdditionalPrinting,
              as: 'printing',
              required: false,
              duplicating: false,
            },
            {
              model: Tag,
              as: 'tags',
              required: false,
              duplicating: false,
            },
          ],
        },
        {
          model: CardType,
          as: 'types',
        },
        {
          where: { ...(params?.setFilter ? { code: params.setFilter } : {}) },
          model: CardSet,
          required: true,
          duplicating: false,
          attributes: {
            exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
          },
        },
      ];
    }
    return array;
  }
}

export default new CardService();
