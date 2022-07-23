import React, {EventHandler, ReactElement, SyntheticEvent, useCallback, useEffect, useRef, useState} from "react";
import {api, loggedApi} from "../axios";
import {FormControl, InputLabel, MenuItem, Select, SpeedDial, SpeedDialAction, TextField} from "@mui/material";
import img from "../assets/img.png"
import img2 from "../assets/img_1.png"
import {CardSerie, CardSet, User} from "../../../api/src/database";

import {CategorizedAutocompleteChecklist} from "../components/CategorizedAutocompleteChecklist";
import {SetFilterListInterface} from "../../../api/src/local_core/types/types/interface/front";
import {number} from "joi";
import {UserCardPossession} from "../../../api/src/database/models/UserCardPossession";

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

  const user: User = JSON.parse(localStorage.getItem('user') ?? "{}");

  let nameInputTimer: any;

  const firstUpdate = useRef(true);

  const fetchSeries = useCallback(async () => {
    const response = await loggedApi.get(`/cardlist/allSeries`);
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
      const response = await loggedApi.get(path);
      setCards(response.data.data)
    }
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
    if (!collectionMode) {
      const response = fetchData('/cardlist/cards' + params);
    } else {
      params += "&unowned=" + (showUnowned ? 'show' : 'hide');
      const response = fetchData('/cardlist/collection' + params);
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

  const modifyQuantity = async (card: any, cardType: string, modification: string, element: EventTarget & HTMLButtonElement) => {
    element.setAttribute("disabled", "true")
    let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
    let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
    if (cardType === 'classic' && modification === 'plus') {
      classicQuantity++;
    }
    if (cardType === 'classic' && modification === 'minus') {
      classicQuantity--;
      if (classicQuantity < 0)
        classicQuantity = 0;
    }
    if (cardType === 'reverse' && modification === 'plus') {
      reverseQuantity++;
    }
    if (cardType === 'reverse' && modification === 'minus') {
      reverseQuantity--;
      if (reverseQuantity < 0)
        reverseQuantity = 0;
    }

    try {
      const response = await loggedApi.post(`/usercards/update`, {
        cardId: card.id,
        classicQuantity: classicQuantity,
        reverseQuantity: reverseQuantity,
      });
      element.removeAttribute("disabled");
      setCards(cards.map((localCard) => {
        if (card.id === localCard.id) {
          localCard.userCardPossessions[0] = response.data.data.result;
        }
        return localCard;
      }));
      console.log(cards);
    } catch (e) {
      console.log(e)
    }
  }

  const setQuantity = async (card: any, cardType: string, element: EventTarget & HTMLInputElement) => {
    element.setAttribute("disabled", "true")
    let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
    let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
    if (cardType === 'classic') {
      if (classicQuantity === Number(element.value)) {
        element.removeAttribute("disabled");
        return
      }
      classicQuantity = element.value;
    }
    if (cardType === 'reverse') {
      if (reverseQuantity === Number(element.value)) {
        element.removeAttribute("disabled");
        return
      }
      reverseQuantity = element.value;
    }

    try {
      const response = await loggedApi.post(`/usercards/update`, {
        cardId: card.id,
        classicQuantity: classicQuantity,
        reverseQuantity: reverseQuantity,
      });
      element.removeAttribute("disabled");
      setCards(cards.map((localCard) => {
        if (card.id === localCard.id) {
          localCard.userCardPossessions[0] = response.data.data.result;
        }
        return localCard;
      }));
    } catch (e) {
      console.log(e)
    }
  }

  const getColorClassname = (userCardPossession: UserCardPossession, reverseOnly: boolean = false) => {
    return ""
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

  // TODO : Nettoyer la leftBar, mettre un loader, gérer les disabled d'input, séparer en components ?, problème de render ?, finir la color pour la possession
  // TODO : Tris pas type, rareté, brillance par rareté

  return <div className="Manager">
    {/*<div className="Manager-leftBar">*/}
    {/*  <div className="Manager-leftBar-content">*/}
    {/*    {*/}
    {/*      series.map((serie, index) => (*/}
    {/*        <div className="Manager-leftBar-serie" key={serie.code}>*/}
    {/*          <SpeedDial*/}
    {/*            key={serie.code}*/}
    {/*            ariaLabel="serie dial"*/}
    {/*            icon={<div className="Manager-leftBar-name">{serie.name}</div>}*/}
    {/*            direction="right"*/}
    {/*          >*/}
    {/*            {serie.cardSets.map((set: CardSet) => (*/}
    {/*              <SpeedDialAction*/}
    {/*                className="Manager-leftBar-set"*/}
    {/*                key={set.code}*/}
    {/*                icon={<img className="Manager-leftBar-setIcon" width="35px" height="35px"*/}
    {/*                           src={`https://assets.tcgdex.net/univ/${serie.code}/${set.code}/symbol`}*/}
    {/*                           onError={(event: SyntheticEvent<HTMLElement>) => {*/}
    {/*                             event.currentTarget.setAttribute("src", "src/assets/setIcons/default.png")*/}
    {/*                           }*/}
    {/*                           }*/}
    {/*                />}*/}
    {/*                tooltipTitle={set.name}*/}
    {/*                onClick={() => activateSetFilter(set.code)}*/}
    {/*              />*/}
    {/*            ))*/}
    {/*            }*/}
    {/*          </SpeedDial></div>))}*/}
    {/*  </div>*/}
    {/*</div>*/}
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
            <>
              <div className={"Collection-Card" + getColorClassname(card.userCardPossessions[0])} key={card.localId + index}
                   data-id={card.name + card.cardSet.code + card.cardSet.cardSerie.code}>
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
                  onLoad={(event) => {
                    event.currentTarget.classList.remove("secondImage")
                  }}
                />
                {collectionMode && <div key={"overlay" + card.localId + index} className="Collection-Card-overlay"/>}
                {collectionMode &&
                <div key={"content" + card.localId + index} className="Collection-Card-overlayBottom">
                  <div className="Collection-Card-overlayBottom-content">
                    <div className="Collection-Card-overlayBottom-content-name">Carte normale</div>
                    <div className="Collection-Card-overlayBottom-content-management">
                      <button className="Collection-Card-overlayBottom-content-minus"
                              onClick={(event) => modifyQuantity(card, 'classic', 'minus', event.currentTarget)}>-
                      </button>
                      <input className="Collection-Card-overlayBottom-content-input" onBlur={(event) => setQuantity(card, 'classic', event.currentTarget)}
                             defaultValue={card?.userCardPossessions?.[0]?.classicQuantity ?? 0} type="number"/>
                      <button className="Collection-Card-overlayBottom-content-plus"
                              onClick={(event) => modifyQuantity(card, 'classic', 'plus', event.currentTarget)}>+
                      </button>
                    </div>
                  </div>
                  {(!separateReverse && card.canBeReverse) && <div className="Collection-Card-overlayBottom-content">
                    <div className="Collection-Card-overlayBottom-content-name">Carte reverse</div>
                    <div className="Collection-Card-overlayBottom-content-management">
                      <button className="Collection-Card-overlayBottom-content-minus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'minus', event.currentTarget)}>-
                      </button>
                      <input className="Collection-Card-overlayBottom-content-input" onBlur={(event) => setQuantity(card, 'reverse', event.currentTarget)}
                             defaultValue={card?.userCardPossessions?.[0]?.reverseQuantity ?? 0} type="number"/>
                      <button className="Collection-Card-overlayBottom-content-plus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'plus', event.currentTarget)}>+
                      </button>
                    </div>
                  </div>}
                </div>}
              </div>
              {collectionMode && separateReverse && card.canBeReverse &&
              <div className={"Collection-Card" + getColorClassname(card.userCardPossessions[0], true)} key={card.localId + index + "2"}
                   data-id={card.name + card.cardSet.code + card.cardSet.cardSerie.code}>
                <img
                  src={"https://assets.tcgdex.net/fr/" + card.cardSet.cardSerie.code + "/" + card.cardSet.code + "/" + card.localId + "/low.jpg"}
                  onError={(event: SyntheticEvent<HTMLElement>) => {
                    if (!event.currentTarget.classList.contains("secondImage")) {
                      event.currentTarget.classList.add("secondImage")
                      event.currentTarget.setAttribute("src", `https://assets.tcgdex.net/fr/${card.cardSet.cardSerie.code}/${card.cardSet.code}/${Number(card.localId)}/low.jpg`);
                    } else {
                      event.currentTarget.setAttribute("src", "src/assets/default_card_img.png")
                    }
                  }}
                  onLoad={(event) => {
                    event.currentTarget.classList.remove("secondImage")
                  }}
                />
                <div key={"overlay" + card.localId + index + "2"} className="Collection-Card-overlay"/>
                <div key={"content" + card.localId + index + "2"} className="Collection-Card-overlayBottom">
                  <div className="Collection-Card-overlayBottom-content">
                    <div className="Collection-Card-overlayBottom-content-name">Carte reverse</div>
                    <div className="Collection-Card-overlayBottom-content-management">
                      <button className="Collection-Card-overlayBottom-content-minus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'minus', event.currentTarget)}>-
                      </button>
                      <input className="Collection-Card-overlayBottom-content-input" onBlur={(event) => setQuantity(card, 'reverse', event.currentTarget)}
                             defaultValue={card?.userCardPossessions?.[0]?.reverseQuantity ?? 0} type="number"/>
                      <button className="Collection-Card-overlayBottom-content-plus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'plus', event.currentTarget)}>+
                      </button>
                    </div>
                  </div>
                </div>
              </div>}
            </>,
          )}
        </div>
      </div>
    </div>
  </div>
};
