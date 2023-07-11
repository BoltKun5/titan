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
import { IUser } from "vokit_core";
import { api } from "../../axios";
import { useSnackbar } from "notistack";

export const CardManager: React.FC = () => {
  const { isLoading, fetch } = useFetchData(isUnloggedPage());
  const { enqueueSnackbar } = useSnackbar();
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
  const [associatedUser, setAssociatedUser] = useState<null | IUser>(null);
  let id: string | undefined = useParams().id;
  if (!isUnloggedPage()) {
    id = undefined;
  }

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
    try {
      if (user.id === '' && !id) return;
      const response = await fetch(`/tag`, {
        ...(id ? { userId: id } : {}),
      });
      setTags(response.data.tags);
    } catch (e) {
      enqueueSnackbar('Une erreur est survenue');
    }
  }, []);

  const fetchAssociatedUser = async () => {
    try {
      const response = await api.get(`/user/get-by-id?id=${id}`)
      setAssociatedUser(response.data.user)
    } catch (e) {
      enqueueSnackbar('Une erreur est survenue');
    }
  }

  useEffect(() => {
    if (!tags) {
      fetchTags();
    }
    if (!associatedUser) {
      fetchAssociatedUser();
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
          <div className="CardManager-collection">
            <span>Collection de</span>
            <div className="CardManager-collection-container">
              <img
                src={`/assets/profile_picture/${associatedUser?.options?.profilePicture ?? 1}.png`}
              />
              <div className="span">{associatedUser?.shownName}</div>
            </div>
          </div>
          {isLoading ? <Loader /> : <CardManagerCardListComponent />}
        </div>
      </div>
    </>
  );
};
