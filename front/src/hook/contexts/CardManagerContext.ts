import React from "react";
import { CardManagerContextType } from '../../front-types/context';

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
  showOptionCards: false,
  setShowOptionCards: () => {
  },
  page: 1,
  setPage: () => { },
  pagination: null,
  setPagination: () => { }
})
