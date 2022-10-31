import { FindOptions } from 'sequelize/types';
import { CardSet } from "../../database";
import { CardType } from "../../database/models/CardType";
import { UserCardPossession } from "../../database/models/UserCardPossession";
import { Op, Options } from "sequelize";

export const getFilterConfig = (req, res, type): FindOptions => {
  const page = Number(req.query?.page ?? 0)
  let mainOrder;
  if (req.query?.order) {
    switch (req.query.order) {
      case "default":
        mainOrder = [[{ model: CardSet, as: "cardSet" }, 'releaseDate', 'desc'], ['localId', 'asc']];
        break;
      case "name":
        mainOrder = [['name', 'asc']];
        break;
      case "type":
        mainOrder = [[{ model: CardType, as: "types" }, 'type', 'asc']]
    }
  }

  return {
    where: {
      name: {
        [Op.iLike]: `%${req.query.namefilter ?? ''}%`,
      },
      ...(req.query.rarity && {
        rarity: {
          [Op.in]: req.query.rarity,
        },
      }),
    },
    ...(mainOrder ? { order: mainOrder } : {}),
    subQuery: false,
    ...(page !== -1 ? { attributes: { exclude: ["cardSet"] } } : {}),
    include: [
      {
        model: UserCardPossession,
        as: "userCardPossessions",
        required: (req.query.unowned ? (req.query.unowned !== 'show') : false),
        duplicating: false,
        where: {
          ...(type === 'collection' ? {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    classicQuantity: {
                      [Op.gt]: 0,
                    },
                  },
                  {
                    reverseQuantity: {
                      [Op.gt]: 0,
                    },
                  },
                ],
              },
              {
                userId: res.locals.currentUser.id,
              },
            ],
          } : {}),
        },
      },
      {
        model: CardType,
        as: "types",
      },
      {
        where: { ...(req.query.setFilter ? { code: req.query.setFilter } : {}) },
        model: CardSet,
        required: true,
        duplicating: false,
        attributes: {
          exclude: ["isPlayableInExpanded", "isPlayableInStandard", "id", "releaseDate", "tcgOnline"],
        },
        as: "cardSet",
      },
    ],
    ...(page === 0 ? { limit: 200 } : (page === -1 ? {} : { limit: 200 })),
    ...(page === 0 ? {} : (page === -1 ? {} : { offset: (page - 1) * 200 }))
  }
}
