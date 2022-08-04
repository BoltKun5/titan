import React, {useCallback, useEffect, useRef, useState} from "react";
import {loggedApi} from "../axios";
import {FormControl, InputLabel, MenuItem, Select, TextField, Tooltip} from "@mui/material";
import {CardSerie, CardSet, User} from "../../../api/src/database";

import {CategorizedAutocompleteChecklist} from "../components/CategorizedAutocompleteChecklist";
import {SetFilterListInterface} from "../../../api/src/local_core/types/types/interface/front";
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
    const regex = new RegExp('^[0-9]+$');
    if (!regex.test(element.value)) {
      element.style.backgroundColor = 'red';
      element.removeAttribute("disabled");
      return
    }
    element.style.backgroundColor = 'white';

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

  const getColorClassname = (userCardPossession: UserCardPossession, reverseOnly: boolean = false, canBeReverse: boolean = true) => {
    if (reverseOnly) return (userCardPossession?.reverseQuantity < 1 ? 'CardQuantity-notOwned' : 'CardQuantity-owned');
    if (!canBeReverse || (separateReverse && !reverseOnly)) return (userCardPossession?.classicQuantity < 1 ? 'CardQuantity-notOwned' : 'CardQuantity-owned');

    if (userCardPossession?.reverseQuantity < 1 && userCardPossession?.classicQuantity < 1) {
      return 'CardQuantity-notOwned';
    }
    if (userCardPossession?.reverseQuantity > 0 && userCardPossession?.classicQuantity > 0) {
      return 'CardQuantity-notOwned';
    }
    if (userCardPossession?.reverseQuantity > 0 && userCardPossession?.classicQuantity < 1) {
      return 'CardQuantity-onlyReverse'
    }
    if (userCardPossession?.classicQuantity > 0 && userCardPossession?.reverseQuantity < 1) {
      return 'CardQuantity-onlyClassic'
    }
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
  // TODO : Tris pas type, rareté, brillance par rareté, limit de sequelize ?

  return <div className="Manager">
    <div className="Manager-leftBar">
      {
        series.map((serie, index) => (
          <div className="Manager-leftBar-serie" key={serie.code}>
            <div className="Manager-leftBar-serieName">{serie.name}</div>
            <div className="Manager-leftBar-setList">
              {serie.cardSets.map((set: CardSet) => (
                <div
                  className="Manager-leftBar-setElement"
                  key={set.code}
                  onClick={() => activateSetFilter(set.code)}
                >
                  <Tooltip title={set.name}>
                    <img src={`./src/assets/setIcons/${set.code}.png`}/>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        ))
      }
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
            <>
              <div
                className={"Collection-Card " + getColorClassname(card.userCardPossessions?.[0], false, card.canBeReverse)}
                key={card.localId + index}
                data-id={card.name + card.cardSet.code + card.cardSet.cardSerie.code}>
                <div className="Collection-Card-imgContainer">
                  <img
                    src={"src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"}
                  />
                  <div className="Collection-Card-img Collection-Card-img-reverseFilter" />
                  <div className="Collection-Card-img Collection-Card-img-classicFilter" />
                </div>
                {collectionMode &&
                <div key={"overlay" + card.localId + index} className="Collection-Card-overlayContainer">
                  <div className="Collection-Card-overlay"/>
                </div>}
                {collectionMode &&
                <div key={"content" + card.localId + index} className="Collection-Card-overlayBottom">
                  <div className="Collection-Card-overlayBottom-content">
                    <div className="Collection-Card-overlayBottom-contentElement">
                      <div className="Collection-Card-overlayBottom-content-name">Carte normale</div>
                      <div className="Collection-Card-overlayBottom-content-management">
                        <button className="Collection-Card-overlayBottom-content-minus"
                                onClick={(event) => modifyQuantity(card, 'classic', 'minus', event.currentTarget)}>-
                        </button>
                        <input className="Collection-Card-overlayBottom-content-input"
                               onBlur={(event) => setQuantity(card, 'classic', event.currentTarget)}
                               value={card?.userCardPossessions?.[0]?.classicQuantity ?? 0} type="number"/>
                        <button className="Collection-Card-overlayBottom-content-plus"
                                onClick={(event) => modifyQuantity(card, 'classic', 'plus', event.currentTarget)}>+
                        </button>
                      </div>
                    </div>
                    {(!separateReverse && card.canBeReverse) &&
                    <div className="Collection-Card-overlayBottom-contentElement">
                      <div className="Collection-Card-overlayBottom-content-name">Carte reverse</div>
                      <div className="Collection-Card-overlayBottom-content-management">
                        <button className="Collection-Card-overlayBottom-content-minus"
                                onClick={(event) => modifyQuantity(card, 'reverse', 'minus', event.currentTarget)}>-
                        </button>
                        <input className="Collection-Card-overlayBottom-content-input" min="0"
                               onBlur={(event) => setQuantity(card, 'reverse', event.currentTarget)}
                               value={card?.userCardPossessions?.[0]?.reverseQuantity ?? 0} type="number"/>
                        <button className="Collection-Card-overlayBottom-content-plus"
                                onClick={(event) => modifyQuantity(card, 'reverse', 'plus', event.currentTarget)}>+
                        </button>
                      </div>
                    </div>}
                  </div>
                </div>}
              </div>
              {collectionMode && separateReverse && card.canBeReverse &&
              <div className={"Collection-Card " + getColorClassname(card.userCardPossessions[0], true)}
                   key={"reverseOnly" + card.localId + index}
                   data-id={card.name + card.cardSet.code + card.cardSet.cardSerie.code}>
                <div className="Collection-Card-imgContainer">
                  <img
                    src={"src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"}
                  />
                  <div className="Collection-Card-img Collection-Card-img-reverseFilter" />
                  <div className="Collection-Card-img Collection-Card-img-classicFilter" />
                </div>
                <div className="Collection-Card-overlayContainer">
                  <div className="Collection-Card-overlay"/>
                </div>
                <div className="Collection-Card-overlayBottom">
                  <div className="Collection-Card-overlayBottom-content">
                    <div className="Collection-Card-overlayBottom-contentElement">
                      <div className="Collection-Card-overlayBottom-content-name">Carte reverse</div>
                      <div className="Collection-Card-overlayBottom-content-management">
                        <button className="Collection-Card-overlayBottom-content-minus"
                                onClick={(event) => modifyQuantity(card, 'reverse', 'minus', event.currentTarget)}>-
                        </button>
                        <input className="Collection-Card-overlayBottom-content-input" min="0"
                               onBlur={(event) => setQuantity(card, 'reverse', event.currentTarget)} readOnly
                               value={card?.userCardPossessions?.[0]?.reverseQuantity ?? 0} type="number"/>
                        <button className="Collection-Card-overlayBottom-content-plus"
                                onClick={(event) => modifyQuantity(card, 'reverse', 'plus', event.currentTarget)}>+
                        </button>
                      </div>
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
