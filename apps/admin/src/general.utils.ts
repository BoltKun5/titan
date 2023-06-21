import { ICard, ICardSet } from "vokit_core";

export const frontRarity: frontRarityType = {
  Common: "Commune",
  Uncommon: "Peu commune",
  Rare: "Rare",
  Holo: "Holographique",
  "Secret Rare": "Secrète",
  "Ultra Rare": "Ultra Rare",
  None: "Promotionnelle",
  Amazing: "Magnifique",
};

type frontRarityType = {
  [index: string]: string;
};

export const getImageSource = (
  card: ICard,
  highQuality: boolean = false
): string => {
  if (highQuality)
    return `${import.meta.env.VITE_ASSETS_URL}/user-application-file/file/download/public-access/${card.imageId}`;
  return `${import.meta.env.VITE_ASSETS_URL}/user-application-file-thumbnail/file-thumbnail/${card.thumbnailId}/download`
};