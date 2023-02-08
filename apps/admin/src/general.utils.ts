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
  const isValid = !isNaN(Number(card.localId));
  if (isValid)
    return (
      import.meta.env.VITE_ASSETS_URL +
      "/" +
      card.cardSet.code +
      "/" +
      card.localId +
      // (highQuality ? "-high" : "") +
      ".jpg"
    );
  return (
    import.meta.env.VITE_ASSETS_URL +
    "/" +
    card.cardSet.code +
    "/" +
    card.localId +
    // (highQuality ? "-high" : "") +
    ".jpg"
  );
};