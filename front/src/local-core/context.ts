import { IUserCardPossession } from "./../../../local-core/types/models/user-card-possession.dto";
import { ITag } from "./../../../local-core/types/models/tag.dto";
import { INotificationElement } from "./interface";
import { PaginationData } from "../../../local-core/types/pagination.type";
import { ICardSerie } from "../../../local-core/types/models/card-serie.dto";
import { UserRoleEnum } from "../../../local-core/enums/user-role.enum";
import { ICard } from "../../../local-core/types/models/card.dto";
import { CardSetFilterInterface } from "../../../local-core";
import React from "react";

export type StoreType = {
  series: ICardSerie[] | null;
  cardSetFilter: CardSetFilterInterface[] | null;
  setCardSetFilter: React.Dispatch<
    React.SetStateAction<CardSetFilterInterface[] | null>
  >;
  nameFilter: string;
  setNameFilter: React.Dispatch<React.SetStateAction<string>>;
  resetAllFilters: () => void;
  rarityFilter: { rarity: string; value: boolean }[];
  setRarityFilter: React.Dispatch<React.SetStateAction<any[]>>;
  order: string;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  collectionMode: boolean;
  setCollectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  separateReverse: boolean;
  setSeparateReverse: React.Dispatch<React.SetStateAction<boolean>>;
  showUnowned: boolean;
  setShowUnowned: React.Dispatch<React.SetStateAction<boolean>>;
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
  user: {
    id: string;
    role: UserRoleEnum;
    showName: string;
  };
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
