import { CardAttack, CardAttribute, CardType, CardAttackCost, CardDamageModification, CardDexId, CardAbility } from '../../database';

export const getFullCardsConfig = () => [
  {
    model: CardType,
    as: "types",
  },
  {
    model: CardAttack,
    as: "attacks",
    include: [{
      model: CardAttackCost,
      as: "costs",
    }],
  },
  {
    model: CardAbility,
    as: "abilities",
  },
  {
    model: CardDamageModification,
    as: "damageModifications",
  },
  {
    model: CardAttribute,
    as: "attributes",
  },
  {
    model: CardDexId,
    as: "dexIds",
  }]
