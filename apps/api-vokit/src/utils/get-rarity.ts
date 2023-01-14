import { CardRarityEnumFrench } from 'vokit_core';

export const getRarity = (card: any): CardRarityEnumFrench => {
  const enumRarity = CardRarityEnumFrench[card.rarity as keyof typeof CardRarityEnumFrench];
  if (enumRarity === CardRarityEnumFrench['Rare'] && card.variants?.holo) {
    return CardRarityEnumFrench['Holo'];
  } else {
    return enumRarity;
  }
};
