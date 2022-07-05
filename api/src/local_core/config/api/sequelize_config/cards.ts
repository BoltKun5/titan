import {CardType} from "../../../../database/models/CardType";
import {CardAttack, CardAttribute} from "../../../../database";
import {CardAttackCost} from "../../../../database/models/CardAttackCost";
import {CardDamageModification} from "../../../../database/models/CardDamageModification";
import {CardDexId} from "../../../../database/models/CardDexId";
import {CardAbility} from "../../../../database/models/CardAbility";

export const fullCardsConfig = [
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
