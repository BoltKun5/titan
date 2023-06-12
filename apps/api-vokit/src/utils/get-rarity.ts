import { CardRarityEnumFrench, PokecardexRarityEnum } from 'vokit_core';

export const getRarity = (card: any): CardRarityEnumFrench => {
  const enumRarity = CardRarityEnumFrench[card.rarity as keyof typeof CardRarityEnumFrench];
  if (enumRarity === CardRarityEnumFrench['Rare'] && card.variants?.holo) {
    return CardRarityEnumFrench['Holo' as keyof typeof CardRarityEnumFrench];
  } else {
    return enumRarity;
  }
};

export const getRarityFromPokecardex = (rarity: string): PokecardexRarityEnum => {
  const enumRarity = PokecardexRarityEnum[rarity as keyof typeof PokecardexRarityEnum];
  return enumRarity ?? 99;
};
