import { ICardAdditionalPrinting } from "./card-additional-printing.model";
import {
  CardRarityEnum,
  CardRarityEnumFrench,
} from "../../src/enums/card-rarity.enum";
import { HeldItemType } from "../dto/card-item.type";
import { ICardAbility } from "./card-ability.model";
import {
  CardEnergyTypeEnum,
  CardCategoryEnum,
  CardEvolutionStageEnum,
  CardTrainerTypeEnum,
} from "../../src/enums";
import { ICardAttack } from "./card-attack.model";
import { ICardAttribute } from "./card-attribute.model";
import { ICardDamageModification } from "./card-damage-modification.model";
import { ICardDexId } from "./card-dex-id.model";
import { ICardSet } from "./card-set.model";
import { ICardType } from "./card-type.model";
import { IUserCardPossession } from "./user-card-possession.model";

export type ICard = {
  id: string;
  name: string;
  rarity: CardRarityEnum | CardRarityEnumFrench;
  category: CardCategoryEnum;
  setId: string;
  cardSet: ICardSet;
  hp: number;
  evolveFrom: string;
  stage: CardEvolutionStageEnum;
  types: ICardType[];
  attacks: ICardAttack[];
  abilities: ICardAbility[];
  effect: string;
  damageModifications: ICardDamageModification[];
  retreat: number;
  regulationMark: string;
  trainerType: CardTrainerTypeEnum;
  canBeNormal: boolean;
  canBeReverse: boolean;
  isHolo: boolean;
  isFirstEdition: boolean;
  attributes: ICardAttribute[];
  localId: string;
  globalId: string;
  dexIds: ICardDexId[];
  description: string;
  level: string;
  item: HeldItemType;
  energyType: CardEnergyTypeEnum;
  userCardPossessions: IUserCardPossession[];
  cardAdditionalPrinting: ICardAdditionalPrinting[];
};
