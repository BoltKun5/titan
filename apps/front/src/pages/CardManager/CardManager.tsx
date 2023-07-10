import React, { useCallback, useContext, useEffect, useState } from "react";
import { CardManagerFilterComponent } from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import { CardManagerCardListComponent } from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import "./style.scss";
import StoreContext from "../../hook/contexts/StoreContext";
import { useFetchData } from "../../hook/api/cards";
import { Loader } from "../../components/UI/Loader/LoaderComponent";
import {
  getFilterQuery,
  isUnloggedPage,
  isUserConnected,
} from "../../general.utils";
import { useParams } from "react-router-dom";

export const CardManager: React.FC = () => {
  const { isLoading, fetch } = useFetchData(isUnloggedPage());
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
    user
  } = useContext(StoreContext);

  let id: string | undefined = useParams().id;
  if (!isUnloggedPage()) {
    id = undefined;
  }

  console.log(id)

  const fetchCards = useCallback(async () => {
    if (!cardSetFilter) return;
    const params = getFilterQuery(
      false,
      cardSetFilter,
      nameFilter,
      page,
      rarityFilter,
      possessionFilter,
      order,
      id ?? null
    );
    const response = await fetch("/card/list", params);
    setCards(response.data.cards);
    setPagination(response.data.pagination);
  }, [
    cardSetFilter,
    nameFilter,
    collectionMode,
    possessionFilter,
    order,
    page,
    id
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
    id,
    user
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
    if (user.id === '' && !id) return;
    const response = await fetch(`/tag`, {
      ...(id ? { userId: id } : {}),
    });
    setTags(response.data.tags);
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
      <div className="CardManager">
        <div className="CardManager-mainContent">
          <CardManagerFilterComponent />
          {isLoading ? <Loader /> : <CardManagerCardListComponent />}
        </div>
      </div>
    </>
  );
};
