import { ICardQuery } from './../../../../packages/core/src/types/interface/api/requests/card.request';
import { Order, FindOptions } from 'sequelize/types';
import { Op } from 'sequelize';
import { ICard, IUser } from 'vokit_core';
import { Card, CardSet, CardType, User, UserCardPossession } from '../database';
import { EntityService, Paginator } from '../core';
import { CardAdditionalPrinting } from '../database/models/card-additional-printing.model';
import { Tag } from '../database/models/tag.model';

export class CardService extends EntityService<Card, ICard> {
  private readonly paginator = new Paginator(User);

  public async getCards(params: ICardQuery, user: IUser): Promise<ICard[]> {
    return await Card.findAll(this.getOptions(params, user));
  }

  public async getCount(params: ICardQuery, user: IUser): Promise<number> {
    return await Card.count(this.getOptions(params, user));
  }

  public getOptions(params: ICardQuery, user: IUser): FindOptions {
    const page = Number(params?.page ?? 0);
    let mainOrder;

    if (params?.order) {
      switch (params.order) {
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
      ...(mainOrder ? { order: mainOrder as Order } : {}),
      subQuery: false,
      ...(page !== -1
        ? { attributes: { exclude: ['cardSet'] } }
        : {
            attributes: {
              ...(params?.stats
                ? {
                    exclude: [
                      'category',
                      'canBeNormal',
                      'description',
                      'effect',
                      'energyType',
                      'evolveFrom',
                      'globalId',
                      'hp',
                      'id',
                      'isFirstEdition',
                      'isHolo',
                      'item',
                      'level',
                      'localId',
                      'name',
                      'regulationMark',
                      'retreat',
                      'setId',
                      'stage',
                      'types',
                      'stage',
                      'trainerType',
                    ],
                  }
                : {
                    exclude: [],
                  }),
            },
          }),
      include: [
        {
          model: CardAdditionalPrinting,
          as: 'cardAdditionalPrinting',
          required: false,
          duplicating: false,
        },
        {
          model: UserCardPossession,
          as: 'userCardPossessions',
          required: params?.unowned ? params.unowned !== 'show' : false,
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
        ...(params?.stats
          ? []
          : [
              {
                model: CardType,
                as: 'types',
              },
            ]),
        {
          where: { ...(params?.setFilter ? { code: params.setFilter } : {}) },
          model: CardSet,
          required: true,
          duplicating: false,
          attributes: {
            exclude: params?.stats
              ? [
                  'cardCount',
                  'cardSerieId',
                  'name',
                  'isPlayableInExpanded',
                  'isPlayableInStandard',
                  'id',
                  'releaseDate',
                  'tcgOnline',
                ]
              : ['isPlayableInExpanded', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
          },
          as: 'cardSet',
        },
      ],
      ...(page === 0 ? { limit: 200 } : page === -1 ? {} : { limit: 200 }),
      ...(page === 0 ? {} : page === -1 ? {} : { offset: (page - 1) * 200 }),
    };
  }
}

export default new CardService();
