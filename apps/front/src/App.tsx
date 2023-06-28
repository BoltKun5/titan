import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { CardManager } from "./pages/CardManager/CardManager";
import { HistoricPage } from "./pages/HistoricPage/HistoricPage";
import { SignUp } from "./pages/SignUp/SignUp";
import { Opening } from "./pages/Opening/Opening";
import { HeaderComponent } from "./components/HeaderComponent/HeaderComponent";
import StoreContext from "./hook/contexts/StoreContext";

import { api, loggedApi } from "./axios";
import { StatPage } from "./pages/StatPage/StatPage";
import { initialRarityFilter, isUnloggedPage } from "./general.utils";
import {
  ICardRarityFilter,
  ICardSetFilter,
  INotificationElement,
} from "./local-core/interface";
import { Loader } from "./components/UI/Loader/LoaderComponent";
import {
  ICard,
  PaginationData,
  CardTypeEnum,
  ICardSerie,
  ITag,
  ICardSet,
  IUser,
} from "vokit_core";
import { Profile } from "./pages/Profile/Profile";

export const App: React.FC = () => {
  // Données de la base
  const [cards, setCards] = useState<ICard[]>([]);

  // Tris
  const [order, setOrder] = useState<string>("default");

  // Autres
  const [collectionMode, setCollectionMode] = useState<boolean>(true);
  const [separateReverse, setSeparateReverse] = useState<boolean>(false);
  const [possessionFilter, setPossessionFilter] = useState<
    | "partial_owned"
    | "partial_unowned"
    | "fully_owned"
    | "multiple_owned"
    | "unowned"
    | null
  >(null);

  const [showOptionCards, setShowOptionCards] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [massInput, setMassInput] = useState(false);

  const [listDisplay, setListDisplay] = useState(false);

  // Filtres
  const [cardSetFilter, setCardSetFilter] = useState<ICardSetFilter[] | null>(
    null
  );
  const [nameFilter, setNameFilter] = useState<string>("");
  const [rarityFilter, setRarityFilter] =
    useState<ICardRarityFilter[]>(initialRarityFilter);

  const [series, setSeries] = useState<ICardSerie[] | null>(null);
  const [tags, setTags] = useState<ITag[] | null>(null);

  const [forceRender, setForceRender] = useState(false);

  const [notifications, setNotifications] = useState<INotificationElement[]>(
    []
  );
  const [user, setUser] = useState<Partial<IUser>>({
    id: "",
    role: 0,
    shownName: "",
  });

  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      if (!localStorage.getItem("token")) throw null;
      const response = await loggedApi.get(`/user/me`);
      setUser(response.data.user);
    } catch (e) {
      if (!isUnloggedPage()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    }
  }, []);

  const fetchSeries = useCallback(async () => {
    const response = await api.get(`/series/all-series`);
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
    setPossessionFilter(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
    possessionFilter,
    setPossessionFilter,
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
    setUser,
    notifications,
    setNotifications,
    tags,
    setTags,
    listDisplay,
    setListDisplay
  };

  useEffect(() => {
    if (series) {
      let setFilterList: ICardSetFilter[] = [];
      series.forEach((serie: ICardSerie) => {
        serie.cardSets?.forEach((set: ICardSet) => {
          setFilterList.push({
            name: set.name,
            id: set.id,
            category: serie.name,
            categoryCode: serie.code,
            status: false,
            code: set.code,
            logoId: set.logoId
          });
        });
      });
      setCardSetFilter(setFilterList);
    }
  }, [series]);

  const showHeader = () => {
    const hideHeaderPaths = ["/login", "/signup", "/devtool"];
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
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<CardManager />} />
                <Route path="/opening" element={<Opening />} />
                <Route path="/stats" element={<StatPage />} />
                <Route path="/historic" element={<HistoricPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/collection/:id" element={<CardManager />} />
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
