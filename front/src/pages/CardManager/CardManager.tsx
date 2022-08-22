import React, {useCallback, useEffect, useReducer, useRef, useState} from "react";
import {loggedApi} from "../../axios";
import {CardSerie, CardSet, Card} from "../../../../api/src/database";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import {CardSetFilterInterface} from "../../../../api/src/local_core/types/types/interface/front";
import {SideBarComponent} from "../../components/SideBarComponent/SideBarComponent";
import {CardManagerFilterComponent} from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import {CardManagerCardListComponent} from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import './CardManager.scss'
import {useFetchCards} from "../../hook/api/cards";
import {MassInputComponent} from "../../components/MassInputComponent/MassInputComponent";
import {reducer} from "../../hook/CardManagerReducer";

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

  const [massInput, setMassInput] = useState<boolean>(false);
  const [firstUpdate, setFirstUpdate] = useState<boolean>(true);

  const {isLoading, fetch} = useFetchCards();


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
            code: set.code
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
        params.setFilter.push(setFilter.id);
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

    let response;
    if (!collectionMode) {
      response = await fetch('/cardlist/cards', params);
    } else {
      params.unowned = (showUnowned ? 'show' : 'hide')
      response = await fetch('/cardlist/collection', params);
    }
    setCards(response.data)
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order])

  useEffect(() => {
    if (firstUpdate) {
      setFirstUpdate(false);
      return;
    }

    fetchCards();
  }, [cardSetFilter, nameFilter, collectionMode, showUnowned, order])

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
    setMassInput
  }

  // TODO : mettre un loader, mask css, remplacer, mettre les queries en objet, utiliser formik, utiliser useMemo pour les call api sur cards
  // TODO : Tris pas type, rareté, brillance par rareté, limit de sequelize

  return (
    <CardManagerContext.Provider value={contextValue}>
      <div className="CardManager">
        {massInput && <MassInputComponent />}
        <SideBarComponent series={series}/>
        <div className="CardManager-mainContent">
          <CardManagerFilterComponent/>
          {
            isLoading ?
              <div className="CardManager-loaderContainer">
                <div className="CardManager-loader">
                  <div className="CardManager-loaderElement"/>
                  <div className="CardManager-loaderElement"/>
                  <div className="CardManager-loaderElement"/>
                  <div className="CardManager-loaderElement"/>
                </div>
              </div>
              :
              <CardManagerCardListComponent/>
          }
        </div>
      </div>
    </CardManagerContext.Provider>
  )
};
