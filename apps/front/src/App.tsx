import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { CardManager } from "./pages/CardManager/CardManager";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { HistoricPage } from "./pages/HistoricPage/HistoricPage";
import { SignUp } from "./pages/SignUp/SignUp";
import { Opening } from "./pages/Opening/Opening";
import { HeaderComponent } from "./components/HeaderComponent/HeaderComponent";
import StoreContext from "./hook/contexts/StoreContext";
import {
  CardSetFilterInterface,
  CardTypeEnum,
  ICard,
  ICardSerie,
  ICardSet,
  PaginationData,
} from "../../local-core";
import { api } from "./axios";
import { StatPage } from "./pages/StatPage/StatPage";
import { initialRarityFilter } from "./pages/CardManager/CardManagerUtils";
import { INotificationElement } from "./local-core/interface";
import { Loader } from "./components/UI/Loader/LoaderComponent";
import { ITag } from "../../local-core/types/models/tag.dto";

export const App: React.FC = () => {
  // Données de la base
  const [cards, setCards] = useState<ICard[]>([]);

  // Tris
  const [order, setOrder] = useState<string>("default");

  // Autres
  const [collectionMode, setCollectionMode] = useState<boolean>(true);
  const [separateReverse, setSeparateReverse] = useState<boolean>(false);
  const [showUnowned, setShowUnowned] = useState<boolean>(true);

  const [showOptionCards, setShowOptionCards] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [massInput, setMassInput] = useState(false);

  // Filtres
  const [cardSetFilter, setCardSetFilter] = useState<
    CardSetFilterInterface[] | null
  >(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<CardTypeEnum[]>([]);
  const [rarityFilter, setRarityFilter] = useState<any[]>(initialRarityFilter);

  const [series, setSeries] = useState<ICardSerie[] | null>(null);
  const [tags, setTags] = useState<ITag[] | null>(null);

  const [forceRender, setForceRender] = useState(false);

  const [notifications, setNotifications] = useState<INotificationElement[]>(
    []
  );

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  const fetchSeries = useCallback(async () => {
    const response = await api.get(`/series/allSeries`);
    setSeries(response.data.data);
  }, []);

  const resetAllFilters = () => {
    if (!cardSetFilter) return;
    setCardSetFilter(
      cardSetFilter.map((element) => {
        element.status = false;
        return element;
      })
    );
    const nameFilterElement = document.querySelector("#nameFilter");
    if (nameFilterElement) {
      (nameFilterElement as HTMLInputElement).value = "";
    }
    setNameFilter("");
    setRarityFilter(
      rarityFilter.map((filter) => {
        filter.value = false;
        return filter;
      })
    );
  };

  useEffect(() => {
    if (!series) {
      fetchSeries();
    }
  }, [series, fetchSeries, tags, setTags]);

  const store = {
    series,
    cardSetFilter,
    setCardSetFilter,
    nameFilter,
    setNameFilter,
    resetAllFilters,
    rarityFilter,
    setRarityFilter,
    order,
    setOrder,
    collectionMode,
    setCollectionMode,
    separateReverse,
    setSeparateReverse,
    showUnowned,
    setShowUnowned,
    cards,
    setCards,
    showOptionCards,
    setShowOptionCards,
    page,
    setPage,
    pagination,
    setPagination,
    massInput,
    setMassInput,
    user,
    notifications,
    setNotifications,
    tags,
    setTags,
  };

  useEffect(() => {
    if (series) {
      let setFilterList: CardSetFilterInterface[] = [];
      series.forEach((serie: ICardSerie) => {
        serie.cardSets.forEach((set: ICardSet) => {
          setFilterList.push({
            name: set.name,
            id: set.id,
            category: serie.name,
            categoryCode: serie.code,
            status: false,
            code: set.code,
          });
        });
      });
      setCardSetFilter(setFilterList);
    }
  }, [series]);

  const showHeader = () => {
    const hideHeaderPaths = ["/", "/signup", "/devtool"];
    return !hideHeaderPaths.includes(window.location.pathname);
  };

  return (
    <>
      {series && cardSetFilter ? (
        <div className="main">
          <div className="content">
            <StoreContext.Provider value={store}>
              {showHeader() && (
                <HeaderComponent
                  forceRender={forceRender}
                  setForceRender={setForceRender}
                />
              )}
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cards" element={<CardManager />} />
                <Route path="/opening" element={<Opening />} />
                <Route path="/stats" element={<StatPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/historic" element={<HistoricPage />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </StoreContext.Provider>
          </div>
        </div>
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </>
  );
};
