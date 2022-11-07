import React, { useCallback, useContext, useEffect, useState } from "react";
import { CardManagerFilterComponent } from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import { CardManagerCardListComponent } from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import './style.scss'
import { useFetchData } from "../../hook/api/cards";
import { CardRarityEnum, PaginationData } from "../../../../local-core";
import StoreContext from "../../hook/contexts/StoreContext";

export const CardManager: React.FC = () => {

  const { isLoading, fetch } = useFetchData();

  const {
    cardSetFilter,
    nameFilter,
    order,
    rarityFilter,
    page,
    collectionMode,
    showUnowned,
    setCards,
    setPagination,
    series,
    setPage
  } = useContext(StoreContext);

  const fetchCards = useCallback(async () => {
    const setFilter = cardSetFilter.filter((setFilter) => setFilter.status);
    const params: Record<string, any> = {};

    if (setFilter.length > 0) {
      params.setFilter = []
      setFilter.forEach((setFilter) => {
        params.setFilter.push(setFilter.code);
      })
    }

    if (nameFilter !== "") {
      params.namefilter = nameFilter;
    }

    if (order === "" || order === null) {
      params.order = "default"
    } else {
      params.order = order
    }

    if (rarityFilter.filter((filter) => filter.value === true).length !== 0) {
      params.rarity = [];
      rarityFilter.forEach((filter) => {
        if (filter.value) {
          // @ts-ignore
          params.rarity.push(CardRarityEnum[filter.rarity])
        }
      })
    }

    params.page = page;

    let response;
    if (!collectionMode) {
      response = await fetch('/cardlist/cards', params);
    } else {
      params.unowned = (showUnowned ? 'show' : 'hide')
      response = await fetch('/cardlist/collection', params);
    }
    setCards(response.data.cards);
    setPagination(response.data.pagination)
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order, page])

  useEffect(() => {
    fetchCards();
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order, rarityFilter, page])

  useEffect(() => {
    setPage(1)
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, rarityFilter])



  if (!series) {
    return <span>Loading</span>
  }

  const contextValue = {

  }

  return (
    <>
      <CardManagerFilterComponent />
      <div className="CardManager">
        <div className="CardManager-mainContent">
          {
            isLoading ?
              <div className="CardManager-loaderContainer">
                <div className="CardManager-loader">
                  <div className="CardManager-loaderElement" />
                  <div className="CardManager-loaderElement" />
                  <div className="CardManager-loaderElement" />
                  <div className="CardManager-loaderElement" />
                </div>
              </div>
              :
              <CardManagerCardListComponent />
          }
        </div>
      </div>
    </>
  )
};
