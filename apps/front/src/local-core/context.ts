import React from "react";
import {
  ICardSerie,
  ICard,
  PaginationData,
  UserRoleEnum,
  ITag,
  IUserCardPossession,
  IUser,
} from "vokit_core";
import {
  ICardRarityFilter,
  ICardSetFilter,
  INotificationElement,
} from "./interface";

export type StoreType = {
  series: ICardSerie[] | null;
  cardSetFilter: ICardSetFilter[] | null;
  setCardSetFilter: React.Dispatch<
    React.SetStateAction<ICardSetFilter[] | null>
  >;
  nameFilter: string;
  setNameFilter: React.Dispatch<React.SetStateAction<string>>;
  resetAllFilters: () => void;
  rarityFilter: ICardRarityFilter[];
  setRarityFilter: React.Dispatch<React.SetStateAction<any[]>>;
  order: string;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  collectionMode: boolean;
  setCollectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  separateReverse: boolean;
  setSeparateReverse: React.Dispatch<React.SetStateAction<boolean>>;
  possessionFilter:
    | "partial_owned"
    | "partial_unowned"
    | "fully_owned"
    | "multiple_owned"
    | "unowned"
    | null;
  setPossessionFilter: React.Dispatch<
    React.SetStateAction<
      | "partial_owned"
      | "partial_unowned"
      | "fully_owned"
      | "multiple_owned"
      | "unowned"
      | null
    >
  >;
  massInput: boolean;
  setMassInput: React.Dispatch<React.SetStateAction<boolean>>;
  cards: ICard[];
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>;
  showOptionCards: boolean;
  setShowOptionCards: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pagination: PaginationData | null;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
  user: Partial<IUser>;
  notifications: INotificationElement[];
  setNotifications: React.Dispatch<
    React.SetStateAction<INotificationElement[]>
  >;
  tags: ITag[] | null;
  setTags: React.Dispatch<React.SetStateAction<ITag[] | null>>;
};

export type CardModalType = {
  localCardPossession: IUserCardPossession[];
  setLocalCardPossession: React.Dispatch<
    React.SetStateAction<IUserCardPossession[]>
  >;
};
