import React from "react";
import { CardManagerContextType } from "../../../../local-core";

export default React.createContext<CardManagerContextType>({
  cardSetFilter: [],
  setCardSetFilter: () => {
  },
  nameFilter: "",
  setNameFilter: () => {
  },
  order: "",
  setOrder: () => {
  },
  collectionMode: false,
  setCollectionMode: () => {
  },
  separateReverse: false,
  setSeparateReverse: () => {
  },
  showUnowned: false,
  setShowUnowned: () => {
  },
  cards: [],
  setCards: () => {
  },
  resetAllFilters: () => {
  },
  massInput: false,
  setMassInput: () => {
  },
  rarityFilter: [],
  setRarityFilter: () => {
  },
  showStats: false,
  setShowStats: () => {
  },
  openingModule: false,
  setOpeningModule: () => {
  },
})
