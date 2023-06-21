import { useContext } from "react";
import { ICardSetFilter, ICardRarityFilter } from "./local-core/interface";
import { CardRarityEnum, ICard, ICardSet } from "vokit_core";
import StoreContext from "./hook/contexts/StoreContext";

export const initialRarityFilter = [
  {
    rarity: "Common",
    value: false,
  },
  {
    rarity: "Uncommon",
    value: false,
  },
  {
    rarity: "Rare",
    value: false,
  },
  {
    rarity: "Holo",
    value: false,
  },
  {
    rarity: "Ultra Rare",
    value: false,
  },
  {
    rarity: "Secret Rare",
    value: false,
  },
  {
    rarity: "None",
    value: false,
  },
  {
    rarity: "Amazing",
    value: false,
  },
];

export const frontRarity: frontRarityType = {
  Common: "Commune",
  Uncommon: "Peu commune",
  Rare: "Rare",
  Holo: "Holographique",
  "Secret Rare": "Secrète",
  "Ultra Rare": "Ultra Rare",
  None: "Promotionnelle",
  Amazing: "Magnifique",
  'Ultra-rare': 'Ultra-rare',
  'Double Rare': 'Double Rare',
  'Illustration Rare': 'Illustration Rare',
  'Illustration Spéciale Rare': 'Illustration Spéciale Rare',
  'Hyper Rare': 'Hyper Rare',
};

type frontRarityType = {
  [index: string]: string;
};

export const initialCardList = [
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
  {
    card: null,
  },
];

export type CardListElement = {
  card: ICard | null;
  type?: "normal" | "reverse";
  error?: string;
};

export const getImageSource = (
  card: ICard,
  highQuality: boolean = false
): string => {
  if (highQuality)
    return `${import.meta.env.VITE_ASSETS_URL}/user-application-file/file/download/public-access/${card.imageId}`;
  return `${import.meta.env.VITE_ASSETS_URL}/user-application-file-thumbnail/file-thumbnail/${card.thumbnailId}/download`
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

export const getFilterQuery = (
  isStats: boolean = false,
  cardSetFilter: ICardSetFilter[],
  nameFilter: string,
  page: number,
  rarityFilter: ICardRarityFilter[],
  possessionFilter:
    | "partial_owned"
    | "partial_unowned"
    | "fully_owned"
    | "multiple_owned"
    | "unowned"
    | null,
  order: string = "",
  forcedId: string | null = null
) => {
  const setFilter = cardSetFilter.filter((setFilter) => setFilter.status);
  const params: Record<string, any> = {};

  if (setFilter && setFilter.length > 0) {
    params.setFilter = [];
    setFilter.forEach((setFilter) => {
      params.setFilter.push(setFilter.code);
    });
  }

  if (nameFilter !== "") {
    params.namefilter = nameFilter;
  }

  if (!isStats) {
    if (order === "" || order === null) {
      params.order = "default";
    } else {
      params.order = order;
    }
  }

  if (!isStats) {
    params.page = page;
  }

  if (possessionFilter) {
    params.possession = possessionFilter;
  }

  if (rarityFilter.filter((filter) => filter.value === true).length !== 0) {
    params.rarity = [];
    rarityFilter.forEach((filter) => {
      if (filter.value) {
        params.rarity.push(
          CardRarityEnum[filter.rarity as keyof typeof CardRarityEnum]
        );
      }
    });
  }

  if (isStats) params.stats = true;

  if (forcedId) params.userId = forcedId;

  return params;
};

export const isUserConnected = () => {
  const { user } = useContext(StoreContext);
  return user.id !== "";
};

export const isUnloggedPage = () => {
  const unloggedPaged = ["collection"];
  return unloggedPaged.includes(window.location.pathname.split("/")[1]);
};
