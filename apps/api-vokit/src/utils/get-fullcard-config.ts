import { CardType } from "../database";


export const getFullCardsConfig = () => [
  {
    model: CardType,
    as: 'types',
  },
  {
    model: CardAbility,
    as: 'abilities',
  },
  {
    model: CardDamageModification,
    as: 'damageModifications',
  },
  {
    model: CardAttribute,
    as: 'attributes',
  },
  {
    model: CardDexId,
    as: 'dexIds',
  },
];
