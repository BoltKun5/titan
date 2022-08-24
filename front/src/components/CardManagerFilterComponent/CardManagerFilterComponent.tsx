import React, {useContext} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip} from "@mui/material";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import {CategorizedAutocompleteChecklist} from "../CategorizedAutocompleteChecklist/CategorizedAutocompleteChecklist";
import {SwitchInputComponent} from "../SwitchInputComponent/SwitchInputComponent"
import './CardManagerFilterComponent.scss'

export const CardManagerFilterComponent: React.FC<{}> = () => {
  const {
    cardSetFilter,
    setCardSetFilter,
    collectionMode,
    setCollectionMode,
    separateReverse,
    setSeparateReverse,
    showUnowned,
    setShowUnowned,
    order,
    setOrder,
    setNameFilter,
    resetAllFilters,
    setMassInput,
    massInput,
    rarityFilter,
    setRarityFilter,
  } = useContext(CardManagerContext);

  const updateSetFilters = (event: any) => {
    if (event.target.classList.contains('CategorizedAutocompleteChecklist-dropdownElement')) {
      const id = event.target.getAttribute("id");
      const newSetFilterList = cardSetFilter.map((setFilter) => {
        if (setFilter.id === id) {
          setFilter.status = !setFilter.status;
        }
        return setFilter
      });
      setCardSetFilter(newSetFilterList);
    } else if (event.target.classList.contains('CategorizedAutocompleteChecklist-title')) {
      const name = event.target.innerText;
      const areAllActivated = cardSetFilter.filter((setFilter) => !setFilter.status && setFilter.category === name).length === 0;
      setCardSetFilter(cardSetFilter.map((setFilter) => {
          if (setFilter.category === name) {
            setFilter.status = !areAllActivated;
          }
          return setFilter
        },
      ));
    }
  }

  const updateRarityFilter = (rarity: string) => {
    setRarityFilter(rarityFilter.map((filter) => {
      if (filter.rarity === rarity)
        filter.value = !filter.value
      return filter
    }))
  }

  let nameInputTimer: string | number | NodeJS.Timeout | undefined;

  const startCountdown = (event: any) => {
    clearTimeout(nameInputTimer);
    nameInputTimer = setTimeout(() => {
      setNameFilter(event.target.value);
    }, 300);
  }

  const frontRarity: any = {
    "Common": "Commune",
    "Uncommon": "Peu commune",
    "Rare": "Rare",
    "Holo": "Holographique",
    "Secret Rare": "Secrète",
    "Ultra Rare": "Ultra Rare",
    None: "Promotionnelle",
  }

  return (
    <div className="CardManagerFilter">
      <div className="CardManagerFilter-top">
        <div className="CardManagerFilter-textInputContainer">
          <label>Filtrer par nom</label>
          <input type="text" className="CardManagerFilter-textInput" id="nameFilter"
                 onKeyUp={startCountdown} onKeyDown={() => clearTimeout(nameInputTimer)}/>
        </div>
        <div className="CardManagerFilter-selectInput">
          <label>Trier par</label>
          <select onChange={(event) => setOrder(event.target.value)} value={order}>
            <option defaultChecked={true} value={"default"}>Set</option>
            <option value={"name"}>Nom</option>
            <option value={"type"}>Type</option>
          </select>
        </div>

        <CategorizedAutocompleteChecklist items={cardSetFilter} placeholder={"Filtrer par sets"}
                                          onFilterChange={updateSetFilters}/>
        <button className="CardManagerFilter-button" onClick={resetAllFilters}>Réinitialiser les
          filtres
        </button>
      </div>
      <div className="CardManagerFilter-bottom">
        <div className="CardManagerFilter-rarityFilter">
          <label>Filtrer par rareté</label>
          <div className="CardManagerFilter-rarityList">
            {
              rarityFilter.map((filter) =>
                <Tooltip title={frontRarity[filter.rarity]} key={"rarity" + filter.rarity}>
                  <div className={"CardManagerFilter-rarityContainer " + (filter.value ? 'selected' : '')}
                       onClick={() => {
                         updateRarityFilter(filter.rarity)
                       }}>
                    <img className="CardManagerFilter-rarityImg" src={"./src/assets/icons/" + filter.rarity + ".png"}/>
                  </div>
                </Tooltip>,
              )
            }
          </div>
        </div>
      </div>
    </div>
  )

}
