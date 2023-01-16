import React, { useCallback, useContext, useEffect, useState } from "react";
import { CardManagerFilterComponent } from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import { CardManagerCardListComponent } from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import "./style.scss";
import StoreContext from "../../hook/contexts/StoreContext";
import { useFetchData } from "../../hook/api/cards";
import { Loader } from "../../components/UI/Loader/LoaderComponent";
import { loggedApi } from "../../axios";
import { CardRarityEnum } from "vokit_core";

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
    setPage,
    tags,
    setTags,
  } = useContext(StoreContext);

  const fetchCards = useCallback(async () => {
    if (!cardSetFilter) return;
    const setFilter = cardSetFilter.filter((setFilter) => setFilter.status);
    const params: Record<string, any> = {};

    if (setFilter.length > 0) {
      params.setFilter = [];
      setFilter.forEach((setFilter) => {
        params.setFilter.push(setFilter.code);
      });
    }

    if (nameFilter !== "") {
      params.namefilter = nameFilter;
    }

    if (order === "" || order === null) {
      params.order = "default";
    } else {
      params.order = order;
    }

    if (rarityFilter.filter((filter) => filter.value === true).length !== 0) {
      params.rarity = [];
      rarityFilter.forEach((filter) => {
        if (filter.value) {
          // @ts-ignore
          params.rarity.push(CardRarityEnum[filter.rarity]);
        }
      });
    }

    params.page = page;

    params.unowned = showUnowned ? "show" : "hide";
    const response = await fetch("/card/list", params);

    setCards(response.cards);
    setPagination(response.pagination);
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order, page]);

  useEffect(() => {
    fetchCards();
  }, [
    cardSetFilter,
    nameFilter,
    collectionMode,
    showUnowned,
    order,
    rarityFilter,
    page,
  ]);

  useEffect(() => {
    setPage(1);
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, rarityFilter]);

  const fetchTags = useCallback(async () => {
    const response = await loggedApi.get(`/tag`);
    setTags(response.data.data.tags);
  }, []);

  useEffect(() => {
    if (!tags) {
      fetchTags();
    }
  }, []);

  if (!series) {
    return <Loader />;
  }

  return (
    <>
      <CardManagerFilterComponent />
      <div className="CardManager">
        <div className="CardManager-mainContent">
          {isLoading ? <Loader /> : <CardManagerCardListComponent />}
        </div>
      </div>
    </>
  );
};
