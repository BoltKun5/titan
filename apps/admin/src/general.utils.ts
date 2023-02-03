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
      "/src/assets/cards/" +
      card.cardSet.code +
      "/" +
      card.localId +
      (highQuality ? "-high" : "") +
      ".jpg"
    );
  return (
    "/src/assets/cards/" +
    card.cardSet.code +
    "/" +
    card.localId +
    (highQuality ? "-high" : "") +
    ".jpg"
  );
};

export const getImageFromSeparatedInfos = (
  card: { name: string; localId: string },
  cardSet: ICardSet
): string => {
  const isValid = !isNaN(Number(card.localId));
  if (isValid)
    return "/src/assets/cards/" + cardSet.code + "/" + card.localId + ".jpg";
  return "/src/assets/cards/" + cardSet.code + "/" + card.localId + ".jpg";
};
