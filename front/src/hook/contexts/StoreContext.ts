import { StoreType } from './../../front-types/context';
import React from "react";

export default React.createContext<StoreType>({
  series: [],
  cardSetFilter: [],
  setCardSetFilter: () => {
  },
  nameFilter: "",
  setNameFilter: () => {
  },
  resetAllFilters: () => {
  },
  rarityFilter: [],
  setRarityFilter: () => {
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
  showOptionCards: false,
  setShowOptionCards: () => {
  },
  page: 1,
  setPage: () => { },
  pagination: null,
  setPagination: () => { },
  massInput: false,
  setMassInput: () => { }
})
