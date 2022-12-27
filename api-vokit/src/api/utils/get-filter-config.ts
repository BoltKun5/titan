import { CardRarityEnum } from './../../../../local-core/enums/card-rarity.enum';
import { FindOptions, Order } from 'sequelize/types';
import { CardSet } from '../../database';
import { CardType } from '../../database/models/card-type';
import { UserCardPossession } from '../../database/models/user-card-possession';
import { Op } from 'sequelize';
import { CardAdditionalPrinting } from '../../database/models/card-additional-printing';
import { IUser } from '../../../../local-core/types';
import { Tag } from '../../database/models/tag';

interface IQuery {
  order?: 'default' | 'name' | 'type';
  namefilter?: string;
  rarity?: CardRarityEnum;
  page?: number;
  stats?: string;
  unowned?: 'show' | 'hide';
  setFilter?: string;
}

export const getFilterConfig = (query: IQuery, currentUser: IUser, type: string): FindOptions => {
  const page = Number(query?.page ?? 0);
  let mainOrder;
  if (query?.order) {
    switch (query.order) {
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
        [Op.iLike]: `%${query?.namefilter ?? ''}%`,
      },
      ...(query?.rarity && {
        rarity: {
          [Op.in]: query.rarity,
        },
      }),
    },
    ...(mainOrder ? { order: mainOrder as Order } : {}),
    subQuery: false,
    ...(page !== -1
      ? { attributes: { exclude: ['cardSet'] } }
      : {
          attributes: {
            ...(query?.stats
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
        required: query?.unowned ? query.unowned !== 'show' : false,
        duplicating: false,
        order: [['createdAt', 'ASC']],
        separate: true,
        where: {
          ...(type === 'collection'
            ? {
                userId: currentUser.id,
              }
            : {}),
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
      ...(query?.stats
        ? []
        : [
            {
              model: CardType,
              as: 'types',
            },
          ]),
      {
        where: { ...(query?.setFilter ? { code: query.setFilter } : {}) },
        model: CardSet,
        required: true,
        duplicating: false,
        attributes: {
          exclude: query?.stats
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
};
