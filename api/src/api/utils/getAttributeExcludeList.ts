const cardAttributesList = ["canBeNormal", "canBeReverse", "category", "description", "effect", "energyType", "evolveFrom", "globalId", "hp", "isFirstEdition", "isHolo", "item", "level", "localId", "name", "rarity", "regulationMark", "retreat", "setId", "stage", "trainerType"]

export const getCardAttributesExcludeArray = (attributesToKeep: string[]): string[] => {
  const attributes = [...cardAttributesList];
  attributesToKeep.forEach((attribute: string) => {
    const index = attributes.indexOf(attribute);
    if (index > -1) {
      attributes.splice(index, 1)
    }
  });
  return attributes
}
