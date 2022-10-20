import { FindOptions } from 'sequelize/types';
import { CardSet } from "../../database";
import { CardType } from "../../database/models/CardType";
import { UserCardPossession } from "../../database/models/UserCardPossession";
import { Op, Options } from "sequelize";

export const getFilterConfig = (req, res, type, page = 0): FindOptions => {
  let mainOrder;
  if (req.query?.order && page !== -1) {
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
          exclude: ["cardSerieId", "isPlayableInExpanded", "isPlayableInStandard", "id", "releaseDate", "tcgOnline"],
        },
        as: "cardSet",
      },
    ],
    ...(page === 0 ? { limit: 300 } : (page === -1 ? {} : { limit: 100 })),
  }
}
