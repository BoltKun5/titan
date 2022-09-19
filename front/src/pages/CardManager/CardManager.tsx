import React, { useCallback, useEffect, useState } from "react";
import { loggedApi } from "../../axios";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import { SideBarComponent } from "../../components/SideBarComponent/SideBarComponent";
import { CardManagerFilterComponent } from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import { CardManagerCardListComponent } from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import './CardManager.scss'
import { useFetchData } from "../../hook/api/cards";
import { MassInputComponent } from "../../components/MassInputComponent/MassInputComponent";
import { initialRarityFilter } from "./CardManagerUtils";
import { SearchStatisticsComponent } from "../../components/SearchStatisticsComponent/SearchStatisticsComponent";
import { OpeningModuleComponent } from "../../components/OpeningModuleComponent/OpeningModuleComponent";
import { CardSetFilterInterface, CardTypeEnum, CardRarityEnum, StatisticsDataType } from "../../../../local-core";
import { ICardSerie } from "../../../../local-core/types/models/card-serie.dto";
import { ICardSet } from "../../../../local-core/types/models/card-set.dto";
import { ICard } from "../../../../local-core/types/models/card.dto";

export const CardManager: React.FC = () => {

  // Données de la base
  const [series, setSeries] = useState<ICardSerie[]>();
  const [cards, setCards] = useState<ICard[]>([]);

  // Filtres
  const [cardSetFilter, setCardSetFilter] = useState<CardSetFilterInterface[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<CardTypeEnum[]>([]);
  const [rarityFilter, setRarityFilter] = useState<any[]>(initialRarityFilter);

  // Tris
  const [order, setOrder] = useState<string>("default");

  // Autres
  const [collectionMode, setCollectionMode] = useState<boolean>(false);
  const [separateReverse, setSeparateReverse] = useState<boolean>(false);
  const [showUnowned, setShowUnowned] = useState<boolean>(false);

  const [massInput, setMassInput] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [firstUpdate, setFirstUpdate] = useState<boolean>(true);
  const [openingModule, setOpeningModule] = useState<boolean>(false);

  const [stats, setStats] = useState<StatisticsDataType | null>(null);

  const { isLoading, fetch } = useFetchData();

  const fetchSeries = useCallback(async () => {
    const response = await loggedApi.get(`/series/allSeries`);
    setSeries(response.data.data);
  }, []);

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
          })
        })
      })
      setCardSetFilter(setFilterList);
      return;
    }
    fetchSeries();
  }, [series, fetchSeries]);

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
        if (filter.value)
          params.rarity.push(CardRarityEnum[filter.rarity])
      })
    }

    let response;
    if (!collectionMode) {
      response = await fetch('/cardlist/cards', params);
    } else {
      params.unowned = (showUnowned ? 'show' : 'hide')
      response = await fetch('/cardlist/collection', params);
    }
    setCards(response.data);

    if (collectionMode) {
      response = await fetch('/cardlist/stats', params);
      setStats(response.data);
    }

  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order])

  useEffect(() => {
    if (firstUpdate) {
      setFirstUpdate(false);
      return;
    }

    fetchCards();
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order, rarityFilter])

  const resetAllFilters = () => {
    setCardSetFilter(cardSetFilter.map((element) => {
      element.status = false;
      return element
    }));
    const nameFilterElement = document.querySelector("#nameFilter");
    if (nameFilterElement) {
      // @ts-ignore
      nameFilterElement.value = "";
    }
    setNameFilter("");
    setRarityFilter(rarityFilter.map((filter) => {
      filter.value = false
      return filter
    }))
  }

  if (!series) {
    return <span>Loading</span>
  }

  const contextValue = {
    cardSetFilter,
    setCardSetFilter,
    nameFilter,
    setNameFilter,
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
    resetAllFilters,
    massInput,
    setMassInput,
    typeFilter,
    setTypeFilter,
    rarityFilter,
    setRarityFilter,
    showStats,
    setShowStats,
    openingModule,
    setOpeningModule
  }

  // TODO : Mettre à jour la connexion, mettre une inscription ?
  // TODO : review les sécurités
  // TODO : utiliser formik

  return (
    <CardManagerContext.Provider value={contextValue}>
      {showStats && stats !== null && <SearchStatisticsComponent data={stats} />}
      {openingModule && <OpeningModuleComponent />}
      <div className="CardManager">
        {massInput && <MassInputComponent />}
        <SideBarComponent series={series} />
        <div className="CardManager-mainContent">
          <CardManagerFilterComponent />
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
    </CardManagerContext.Provider>
  )
};
