import React, { useCallback, useContext, useEffect, useState } from "react";
import { CardManagerFilterComponent } from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import { CardManagerCardListComponent } from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import "./style.scss";
import StoreContext from "../../hook/contexts/StoreContext";
import { useFetchData } from "../../hook/api/cards";
import { Loader } from "../../components/UI/Loader/LoaderComponent";
import { loggedApi } from "../../axios";
import { CardRarityEnum } from "vokit_core";
import { getFilterQuery } from "./CardManagerUtils";

export const CardManager: React.FC = () => {
  const { isLoading, fetch } = useFetchData();

  const {
    cardSetFilter,
    nameFilter,
    order,
    rarityFilter,
    page,
    collectionMode,
    possessionFilter,
    setCards,
    setPagination,
    series,
    setPage,
    tags,
    setTags,
  } = useContext(StoreContext);

  const fetchCards = useCallback(async () => {
    if (!cardSetFilter) return;
    const params = getFilterQuery(
      false,
      cardSetFilter,
      nameFilter,
      page,
      rarityFilter,
      possessionFilter,
      order
    );
    const response = await fetch("/card/list", params);
    setCards(response.cards);
    setPagination(response.pagination);
  }, [
    cardSetFilter,
    nameFilter,
    collectionMode,
    possessionFilter,
    order,
    page,
  ]);

  useEffect(() => {
    fetchCards();
  }, [
    cardSetFilter,
    nameFilter,
    collectionMode,
    possessionFilter,
    order,
    rarityFilter,
    page,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    cardSetFilter,
    nameFilter,
    collectionMode,
    possessionFilter,
    rarityFilter,
  ]);

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
