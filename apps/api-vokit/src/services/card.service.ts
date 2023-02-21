import { FindOptions, Includeable, IncludeOptions } from 'sequelize/types';
import { Op, literal } from 'sequelize';
import {
  CardAdditionalPrintingTypeEnum,
  CardRarityEnum,
  ICard,
  ICardQuery,
  IUser,
  StatisticsDataType,
} from 'vokit_core';
import { Card, CardSet, CardType, User, UserCardPossession } from '../database';
import { EntityService, Paginator } from '../core';
import { CardAdditionalPrinting } from '../database/models/card-additional-printing.model';
import { Tag } from '../database/models/tag.model';

export class CardService extends EntityService<Card, ICard> {
  private readonly paginator = new Paginator(User);

  private resultPerPage = 200;

  public async getCards(params: ICardQuery, user: IUser): Promise<ICard[]> {
    try {
      return await Card.findAll(this.getOptions(params, user));
    } catch (e: any) {
      console.log(e);
      return [];
    }
  }

  public async getCount(params: ICardQuery, user: IUser): Promise<number> {
    params.page = -1;
    return await Card.count(this.getOptions(params, user));
  }

  public getOptions(params: ICardQuery, user: IUser): FindOptions | IncludeOptions {
    return {
      where: {
        ...(params?.hidden
          ? {}
          : {
              name: {
                [Op.iLike]: `%${params?.namefilter ?? ''}%`,
              },
            }),
        ...(params?.rarity && {
          rarity: {
            [Op.in]: params.rarity,
          },
        }),
        ...(params.possession
          ? {
              id: {
                [Op.in]: literal(`(${this.getPossessionQuery(params.possession, user)})`),
              },
            }
          : {}),
      },
      ...this.getOrder(params.order),
      subQuery: false,
      ...this.getCardAttributeList(params),
      include: [...this.getIncludeArray(params, user)] as Includeable[] | undefined,
      ...this.getPagination(params),
    };
  }

  public getPossessionQuery(possession: ICardQuery['possession'], user: IUser): string {
    switch (possession) {
      case 'unowned':
        return `SELECT "card".id 
        FROM "card" 
        left outer join "userCardPossession" ucp ON ucp."cardId" = "card"."id" and ucp."userId" = '${user.id}'
        GROUP BY "card"."id" 
        having count(ucp.id) = 0`;
      case 'partial_owned':
        return `SELECT sub.id
          FROM (
            select "card".id, count(ucp.id)
            from "card"
            left outer join "userCardPossession" ucp on ucp."cardId" = "card"."id" and ucp."userId" = '${user.id}' and ucp."deletedAt" is null
            left outer join "cardAdditionalPrinting" cap on cap.id = ucp."printingId" 
            group by "card"."id", cap.type 
            having count(ucp.id) > 0
            ) sub
          GROUP BY sub."id" 
          having count(sub.id) > 0`;
      case 'partial_unowned':
        return `select c.id
        FROM card c
        left join (
          select "card".id, count(ucp."cardId")
          from "card"
          left outer join "userCardPossession" ucp on ucp."cardId" = "card"."id" and ucp."userId" = '${user.id}'
          left outer join "cardAdditionalPrinting" cap on cap.id = ucp."printingId" 
          group by "card"."id", cap.type 
          having count(ucp.id) > 0
          order by "card"."name" 
          ) sub on sub.id = c.id
        left outer join (
          select cap."cardId" as id, count(cap."cardId")
          from "cardAdditionalPrinting" cap
          group by cap."cardId"
          ) sub2 on sub2.id = c.id
        group by c.id, sub2.count
        having coalesce(sub2.count, 0)+1 > count(sub.id)
        order by c."name"`;
      case 'fully_owned':
        return `select c.id
        FROM card c
        left join (
          select "card".id, count(ucp."cardId")
          from "card"
          left outer join "userCardPossession" ucp on ucp."cardId" = "card"."id" and ucp."userId" = '${user.id}' and ucp."deletedAt" is null
          left outer join "cardAdditionalPrinting" cap on cap.id = ucp."printingId" 
          group by "card"."id", cap.type 
          having count(ucp.id) > 0
          order by "card"."name" 
          ) sub on sub.id = c.id
        left outer join (
          select cap."cardId" as id, count(cap."cardId")
          from "cardAdditionalPrinting" cap
          group by cap."cardId"
          ) sub2 on sub2.id = c.id
        group by c.id, sub2.count
        having coalesce(sub2.count, 0)+1 = count(sub.id)
        order by c."name"`;
      case 'multiple_owned':
        return `select c.id
        FROM card c
        left join (
          select "card".id, count(ucp."cardId") as c
          from "card"
          left outer join "userCardPossession" ucp on ucp."cardId" = "card"."id" and ucp."userId" = '${user.id}' and ucp."deletedAt" is null
          left outer join "cardAdditionalPrinting" cap on cap.id = ucp."printingId" 
          group by "card"."id", cap.type 
          having count(ucp.id) > 0
          ) sub on sub.id = c.id
        where sub."c" > 1
        group by c.id, sub."c"
        order by c."name"`;
      default:
        return ``;
    }
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
          attributes: {
            exclude: ['cardId'],
          },
        },
        {
          model: UserCardPossession,
          as: 'userCardPossessions',
          order: [['createdAt', 'ASC']],
          required: false,
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
          where: {
            ...(params?.setFilter
              ? {
                  code: params.setFilter,
                  ...(!params?.hidden
                    ? { id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' } }
                    : {}),
                }
              : {
                  ...(!params?.hidden
                    ? {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }
                    : {}),
                }),
          },
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

  public async getStats(params: ICardQuery, user: IUser): Promise<StatisticsDataType | undefined> {
    try {
      const filterOptions: IncludeOptions = this.getOptions(params, user) as IncludeOptions;

      const rarityCount: any = await Card.count({
        attributes: ['rarity'],
        group: ['rarity'],
        ...filterOptions,
        include: [
          {
            where: {
              ...(params?.setFilter
                ? {
                    code: params.setFilter,
                    id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                  }
                : {
                    id: {
                      [Op.ne]: '00000000-0000-0000-0000-000000000000',
                    },
                  }),
            },
            model: CardSet,
            required: true,
            duplicating: false,
            attributes: {
              exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
            },
          },
        ],
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
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
          },
        ],
        where: {
          userId: user.id,
        },
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
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
          },
        ],
        where: {
          userId: user.id,
        },
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
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
          },
        ],
        where: {
          userId: user.id,
        },
      });

      const distinctNormal = (
        await UserCardPossession.count({
          where: {
            printingId: null,
            userId: user.id,
          },
          group: ['cardId'],
          include: [
            {
              model: Card,
              as: 'card',
              required: true,
              ...filterOptions,
              include: [
                {
                  where: {
                    ...(params?.setFilter
                      ? {
                          code: params.setFilter,
                          id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                        }
                      : {
                          id: {
                            [Op.ne]: '00000000-0000-0000-0000-000000000000',
                          },
                        }),
                  },
                  model: CardSet,
                  required: true,
                  duplicating: false,
                  attributes: {
                    exclude: [
                      'cardCount',
                      'isPlayableInStandard',
                      'id',
                      'releaseDate',
                      'tcgOnline',
                    ],
                  },
                },
              ],
            },
          ],
        })
      ).length;

      const distinctNormalPossible = await Card.count({
        ...this.getOptions(params, user),
        include: [
          {
            where: {
              ...(params?.setFilter
                ? {
                    code: params.setFilter,
                    id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                  }
                : {
                    id: {
                      [Op.ne]: '00000000-0000-0000-0000-000000000000',
                    },
                  }),
            },
            model: CardSet,
            required: true,
            duplicating: false,
            attributes: {
              exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
            },
          },
        ],
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
              include: [
                {
                  where: {
                    ...(params?.setFilter
                      ? {
                          code: params.setFilter,
                          id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                        }
                      : {
                          id: {
                            [Op.ne]: '00000000-0000-0000-0000-000000000000',
                          },
                        }),
                  },
                  model: CardSet,
                  required: true,
                  duplicating: false,
                  attributes: {
                    exclude: [
                      'cardCount',
                      'isPlayableInStandard',
                      'id',
                      'releaseDate',
                      'tcgOnline',
                    ],
                  },
                },
              ],
            },
          ],
          group: ['UserCardPossession.cardId'],
          where: {
            userId: user.id,
          },
        })
      ).length;

      const distinctReversePossible = await Card.count({
        ...this.getOptions(params, user),
        include: [
          {
            model: CardAdditionalPrinting,
            as: 'cardAdditionalPrinting',
            required: true,
            where: {
              type: CardAdditionalPrintingTypeEnum.REVERSE,
            },
          },
          {
            where: {
              ...(params?.setFilter
                ? {
                    code: params.setFilter,
                    id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                  }
                : {
                    id: {
                      [Op.ne]: '00000000-0000-0000-0000-000000000000',
                    },
                  }),
            },
            model: CardSet,
            required: true,
            duplicating: false,
            attributes: {
              exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
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
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
          },
        ],
        where: {
          userId: user.id,
        },
      });

      const totalNormal = await UserCardPossession.count({
        where: {
          printingId: null,
          userId: user.id,
        },
        include: [
          {
            model: Card,
            as: 'card',
            required: true,
            ...filterOptions,
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
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
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
          },
        ],
        where: {
          userId: user.id,
        },
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
        ...this.getOptions(params, user),
        include: [
          {
            model: CardAdditionalPrinting,
            as: 'cardAdditionalPrinting',
          },
          {
            where: {
              ...(params?.setFilter
                ? {
                    code: params.setFilter,
                    id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                  }
                : {
                    id: {
                      [Op.ne]: '00000000-0000-0000-0000-000000000000',
                    },
                  }),
            },
            model: CardSet,
            required: true,
            duplicating: false,
            attributes: {
              exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
            },
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
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
          },
          {
            model: CardAdditionalPrinting,
            as: 'printing',
          },
        ],
        where: {
          userId: user.id,
        },
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
            include: [
              {
                where: {
                  ...(params?.setFilter
                    ? {
                        code: params.setFilter,
                        id: { [Op.ne]: '00000000-0000-0000-0000-000000000000' },
                      }
                    : {
                        id: {
                          [Op.ne]: '00000000-0000-0000-0000-000000000000',
                        },
                      }),
                },
                model: CardSet,
                required: true,
                duplicating: false,
                attributes: {
                  exclude: ['cardCount', 'isPlayableInStandard', 'id', 'releaseDate', 'tcgOnline'],
                },
              },
            ],
          },
          {
            model: CardAdditionalPrinting,
            as: 'printing',
          },
        ],
        where: {
          userId: user.id,
        },
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

      return {
        distinctPossible: distinctNormalPossible + distinctReversePossible,
        distinctOwned: distinctNormal + distinctReverse,
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
    } catch (e: any) {
      return undefined;
      console.log(e.message);
    }
  }
}

export default new CardService();
