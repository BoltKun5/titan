export type StatisticsDataType = {
  distinctOwned: number,
  distinctPossible: number,
  distinctNormal: number,
  distinctNormalPossible: number,
  distinctReverse: number,
  distinctReversePossible: number,

  totalNormal: number,
  totalReverse: number,
  totalOwned: number,

  countByRarity: {
    "Amazing": CountByRarityType,
    "Common": CountByRarityType,
    "None": CountByRarityType,
    "Rare": CountByRarityType,
    "Secret Rare": CountByRarityType,
    "Ultra Rare": CountByRarityType,
    "Uncommon": CountByRarityType,
    "Holo": CountByRarityType
  },
  countBySet: {
    [key: string]: {
      totalNormal: number,
      totalReverse: number,
      totalOwned: number,
      distinctNormal: number,
      distinctReverse: number,
      distinctPossibleNormal: number,
      distinctPossibleReverse: number,
      distinctOwned: number,
      distinctPossible: number
    }
  }
};

export type CountByRarityType = {
  totalOwned: number,
  distinctOwned: number,
  distinctPossible: number
}
