export const getTypeEnum = (type: localCardType) => {
  return localCardType[type] ?? null;
};

export enum localCardType {
  'Combat' = 5,
  'Dragon' = 10,
  'Eau' = 3,
  'Feu' = 2,
  'Fée' = 11,
  'Incolore' = 7,
  'Métal' = 9,
  'Obscurité' = 8,
  'Plante' = 1,
  'Psy' = 6,
  'Électrique' = 4,
}
