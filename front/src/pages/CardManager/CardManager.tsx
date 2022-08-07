import React, {useCallback, useEffect, useRef, useState} from "react";
import {loggedApi} from "../../axios";
import {CardSerie, CardSet, Card} from "../../../../api/src/database";
import CardManagerContext from "../../contexts/CardManagerContext";
import {CardSetFilterInterface} from "../../../../api/src/local_core/types/types/interface/front";
import {SideBarComponent} from "../../components/SideBarComponent/SideBarComponent";
import {CardManagerFilterComponent} from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import {CardManagerCardListComponent} from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import './CardManager.scss'

export const CardManager: React.FC = () => {
  // Données de la base
  const [series, setSeries] = useState<CardSerie[]>();
  const [cards, setCards] = useState<Card[]>([]);

  // Filtres
  const [cardSetFilter, setCardSetFilter] = useState<CardSetFilterInterface[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");

  // Tris
  const [order, setOrder] = useState<string>("default");

  // Autres
  const [collectionMode, setCollectionMode] = useState<boolean>(false);
  const [separateReverse, setSeparateReverse] = useState<boolean>(false);
  const [showUnowned, setShowUnowned] = useState<boolean>(false);

  const firstUpdate = useRef(true);

  const fetchSeries = useCallback(async () => {
    const response = await loggedApi.get(`/cardlist/allSeries`);
    setSeries(response.data.data);
  }, []);

  useEffect(() => {
    if (series) {
      let setFilterList: CardSetFilterInterface[] = [];
      series.forEach((serie: CardSerie) => {
        serie.cardSets.forEach((set: CardSet) => {
          setFilterList.push({
            name: set.name,
            id: set.code,
            category: serie.name,
            categoryCode: serie.code,
            status: false,
          })
        })
      })
      setCardSetFilter(setFilterList);
      return;
    }
    fetchSeries();
  }, [series, fetchSeries]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const fetchData = async (path: string) => {
      const response = await loggedApi.get(path);
      setCards(response.data.data)
    }
    let params = "?";
    const setFilters = cardSetFilter.filter((setFilter) => setFilter.status);
    if (setFilters.length > 0) {
      setFilters.forEach((setFilter) => {
        params += "&setfilter[]=" + setFilter.id
      })
    }
    if (nameFilter !== "") {
      params += "&namefilter=" + nameFilter;
    }
    (order === "" || order === null) ? params += "&order=default" : params += `&order=${order}`
    if (!collectionMode) {
      const response = fetchData('/cardlist/cards' + params);
    } else {
      params += "&unowned=" + (showUnowned ? 'show' : 'hide');
      const response = fetchData('/cardlist/collection' + params);
    }
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order])

  const resetAllFilters = () => {
    setCardSetFilter([]);
    const nameFilterElement = document.querySelector("#nameFilter");
    if (nameFilterElement) {
      // @ts-ignore
      nameFilterElement.value = "";
    }
    setNameFilter("");
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
  }

  // TODO : mettre un loader,
  // TODO : Tris pas type, rareté, brillance par rareté, limit de sequelize, lazy loading

  return (
    <CardManagerContext.Provider value={contextValue}>
      <div className="CardManager">
        <SideBarComponent series={series}/>
        <div className="CardManager-mainContent">
          <CardManagerFilterComponent/>
          <CardManagerCardListComponent/>
        </div>
      </div>
    </CardManagerContext.Provider>
  )
};
