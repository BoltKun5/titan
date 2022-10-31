import { PaginationData } from './../../../local-core/types/pagination.type';
import { ICardSerie } from './../../../local-core/types/models/card-serie.dto';
import { UserRoleEnum } from '../../../local-core/enums/user-role.enum';
import { ICard } from '../../../local-core/types/models/card.dto';
import { CardSetFilterInterface } from "../../../local-core";
import React from 'react'

export type CardManagerContextType = {
  cardSetFilter: CardSetFilterInterface[],
  setCardSetFilter: React.Dispatch<React.SetStateAction<CardSetFilterInterface[]>>,
  nameFilter: string,
  setNameFilter: React.Dispatch<React.SetStateAction<string>>,
  order: string,
  setOrder: React.Dispatch<React.SetStateAction<string>>,
  collectionMode: boolean,
  setCollectionMode: React.Dispatch<React.SetStateAction<boolean>>,
  separateReverse: boolean,
  setSeparateReverse: React.Dispatch<React.SetStateAction<boolean>>,
  showUnowned: boolean,
  setShowUnowned: React.Dispatch<React.SetStateAction<boolean>>,
  cards: ICard[],
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>,
  resetAllFilters: () => void,
  massInput: boolean,
  setMassInput: React.Dispatch<React.SetStateAction<boolean>>,
  rarityFilter: { rarity: string, value: boolean }[],
  setRarityFilter: React.Dispatch<React.SetStateAction<any[]>>,
  showStats: boolean,
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>,
  openingModule: boolean,
  setOpeningModule: React.Dispatch<React.SetStateAction<boolean>>,
  showOptionCards: boolean,
  setShowOptionCards: React.Dispatch<React.SetStateAction<boolean>>,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  pagination: PaginationData | null,
  setPagination: React.Dispatch<React.SetStateAction<any>>,
}

export type StoreType = {
  series: ICardSerie[]
}