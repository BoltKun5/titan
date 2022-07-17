import React, {EventHandler, ReactElement, SyntheticEvent, useCallback, useEffect, useRef, useState} from "react";
import {api} from "../axios";
import {FormControl, InputLabel, MenuItem, Select, SpeedDial, SpeedDialAction, TextField} from "@mui/material";
import img from "../assets/img.png"
import img2 from "../assets/img_1.png"
import {CardSerie, CardSet} from "../../../api/src/database";

import {CategorizedAutocompleteChecklist} from "../components/CategorizedAutocompleteChecklist";
import {SetFilterListInterface} from "../../../api/src/local_core/types/types/interface/front";

export const CardManager: React.FC = () => {
  // Données de la base
  const [series, setSeries] = useState<CardSerie[]>();
  const [cards, setCards] = useState<any[]>([]);

  // Filtres
  const [setFilterList, setSetFilterList] = useState<SetFilterListInterface[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");

  // Tris
  const [order, setOrder] = useState<string>("default");

  // Autres
  const [collectionMode, setCollectionMode] = useState<boolean>(false);
  const [separateReverse, setSeparateReverse] = useState<boolean>(false);
  const [showUnowned, setShowUnowned] = useState<boolean>(false);

  let nameInputTimer: any;

  const firstUpdate = useRef(true);

  const fetchSeries = useCallback(async () => {
    const response = await api.get(`/cardlist/allSeries`);
    setSeries(response.data.data);
  }, []);

  useEffect(() => {
    if (series) {
      let setFilterList: SetFilterListInterface[] = [];
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
      setSetFilterList(setFilterList);
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
      const response = await api.get(path);
      setCards(response.data.data)
    }
    if (!collectionMode) {
      let params = "?";
      const setFilters = setFilterList.filter((setFilter) => setFilter.status);
      if (setFilters.length > 0) {
        setFilters.forEach((setFilter) => {
          params += "&setfilter[]=" + setFilter.id
        })
      }
      if (nameFilter !== "") {
        params += "&namefilter=" + nameFilter;
      }
      (order === "" || order === null) ? params += "&order=default" : params += `&order=${order}`

      const response = fetchData('/cardlist/cards' + params);
    }
  }, [setFilterList, nameFilter, collectionMode, showUnowned, order])

  const startCountdown = (event: any) => {
    clearTimeout(nameInputTimer);
    nameInputTimer = setTimeout(() => {
      setNameFilter(event.target.value);
    }, 300);
  }

  const updateSetFilters = (event: any) => {
    if (event.target.classList.contains('AutocompleteCheck-dropdown-element')) {
      const id = event.target.getAttribute("id");
      const newSetFilterList = setFilterList.map((setFilter) => {
        if (setFilter.id === id) {
          setFilter.status = !setFilter.status;
        }
        return setFilter
      });
      setSetFilterList(newSetFilterList);
    } else if (event.target.classList.contains('AutocompleteCheck-title')) {
      const name = event.target.innerText;
      const areAllActivated = setFilterList.filter((setFilter) => !setFilter.status && setFilter.category === name).length === 0;
      setSetFilterList(setFilterList.map((setFilter) => {
          if (setFilter.category === name) {
            setFilter.status = !areAllActivated;
          }
          return setFilter
        },
      ));
    }
  }

  const resetAllFilters = () => {
    setSetFilterList([]);
    const nameFilterElement = document.querySelector("#nameFilter");
    if (nameFilterElement) { // @ts-ignore
      nameFilterElement.value = "";
    }
    setNameFilter("");
  }

  const activateSetFilter = (setCode: string) => {
    resetAllFilters();
    setSetFilterList(setFilterList.map((setFilter) => {
      setFilter.status = (setFilter.id === setCode);
      return setFilter
    }))
  }

  if (!series) {
    return <span>Loading</span>
  }

  return <div className="Manager">
    <div className="Manager-leftBar">
      {
        series.map((serie, index) => (
          <div className="Manager-leftBar-serie" key={serie.code}>
            <SpeedDial
              key={serie.code}
              ariaLabel="serie dial"
              icon={<img className="Manager-leftBar-serieImage" src={index === 0 ? img : img2}/>}
              direction="right"
            >
              {serie.cardSets.map((set: CardSet) => (
                <SpeedDialAction
                  className="Manager-leftBar-set"
                  key={set.code}
                  icon={<img className="Manager-leftBar-setIcon" width="35px" height="35px"
                             src={`https://assets.tcgdex.net/univ/${serie.code}/${set.code}/symbol`}/>}
                  tooltipTitle={set.name}
                  onClick={() => activateSetFilter(set.code)}
                />
              ))
              }
            </SpeedDial></div>))}
    </div>
    <div className="Manager-mainContent">
      <div className="Manager-filter">
        <TextField className="Manager-filter-textInput" id="nameFilter" label="Filtrer par nom"
                   variant="outlined" onKeyUp={startCountdown} onKeyDown={() => clearTimeout(nameInputTimer)}/>
        <CategorizedAutocompleteChecklist items={setFilterList} placeholder={"Trier par sets"}
                                          onFilterChange={updateSetFilters}/>

        <div className="Manager-filter-switchInput">
          <label htmlFor={"collectionMode"}
                 className={collectionMode ? "Manager-filter-switchInput-activated" : ""}>
            Activer le mode Collection
            <div className={"Manager-filter-switchInput-light"}/>
          </label>
          <input type={"checkbox"} onChange={e => setCollectionMode(e.target.checked)} id={"collectionMode"}/>
        </div>
        <div className="Manager-filter-switchInput">
          <label htmlFor={"separateReverse"}
                 className={!collectionMode ? "Manager-filter-switchInput-disabled" : separateReverse ? "Manager-filter-switchInput-activated" : ""}>
            Séparer les cartes Reverse
            <div className={"Manager-filter-switchInput-light"}/>
          </label>
          <input type={"checkbox"} onChange={e => setSeparateReverse(e.target.checked)} id={"separateReverse"}/>
        </div>
        <div className="Manager-filter-switchInput">
          <label htmlFor={"showUnowned"}
                 className={!collectionMode ? "Manager-filter-switchInput-disabled" : showUnowned ? "Manager-filter-switchInput-activated" : ""}>
            Afficher les cartes non-possédées
            <div className={"Manager-filter-switchInput-light"}/>
          </label>
          <input type={"checkbox"} onChange={e => setShowUnowned(e.target.checked)} id={"showUnowned"}/>
        </div>
        <div className="Manager-filter-selectInput">
          <FormControl>
            <InputLabel id={"orderLabel"}>Trier par</InputLabel>
            <Select
              sx={{
                width: 300,
              }}
              labelId={"orderLabel"}
              value={order}
              label={"Trier par"}
              onChange={(event) => setOrder(event.target.value)}
            >
              <MenuItem defaultChecked value={"default"}>Set</MenuItem>
              <MenuItem value={"name"}>Nom</MenuItem>
              <MenuItem value={"type"}>Type</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="Manager-cardList">
        <div className="Collection-CardList">
          {cards.map((card: any, index) =>
            <div className="Collection-Card" key={card.localId + index} data-id={card.name + card.cardSet.code + card.cardSet.cardSerie.code}>
              <img
                src={"https://assets.tcgdex.net/fr/" + card.cardSet.cardSerie.code + "/" + card.cardSet.code + "/" + card.localId + "/low.jpg"}
                onError={(event: SyntheticEvent<HTMLElement>) => {
                  if (!event.currentTarget.classList.contains("secondImage")) {
                    console.log("https://assets.tcgdex.net/fr/" + card.cardSet.cardSerie.code + "/" + card.cardSet.code + "/" + card.localId + "/low.jpg");
                    event.currentTarget.classList.add("secondImage")
                    event.currentTarget.setAttribute("src", `https://assets.tcgdex.net/fr/${card.cardSet.cardSerie.code}/${card.cardSet.code}/${Number(card.localId)}/low.jpg`);
                  } else {
                    event.currentTarget.setAttribute("src", "src/assets/default_card_img.png")
                  }
                }}
                onLoad={(event) => {event.currentTarget.classList.remove("secondImage")}}
              />
            </div>,
          )}
        </div>
      </div>
    </div>
  </div>
};
