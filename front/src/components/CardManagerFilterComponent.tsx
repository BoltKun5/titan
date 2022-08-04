import React, {useContext} from "react";
import {FormControl, InputLabel, MenuItem, Select, TextField, Tooltip} from "@mui/material";
import {CardSet} from "../../../api/src/database";
import {SideBareComponentPropsType} from "../../typing/types";
import CardManagerContext from "../contexts/CardManagerContext";
import {CategorizedAutocompleteChecklist} from "./CategorizedAutocompleteChecklist";

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
  } = useContext(CardManagerContext);

  const updateSetFilters = (event: any) => {
    if (event.target.classList.contains('AutocompleteCheck-dropdown-element')) {
      const id = event.target.getAttribute("id");
      const newSetFilterList = cardSetFilter.map((setFilter) => {
        if (setFilter.id === id) {
          setFilter.status = !setFilter.status;
        }
        return setFilter
      });
      setCardSetFilter(newSetFilterList);
    } else if (event.target.classList.contains('AutocompleteCheck-title')) {
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

  let nameInputTimer: string | number | NodeJS.Timeout | undefined;

  const startCountdown = (event: any) => {
    clearTimeout(nameInputTimer);
    nameInputTimer = setTimeout(() => {
      setNameFilter(event.target.value);
    }, 300);
  }

  return (
    <div className="Manager-filter">
      <TextField className="Manager-filter-textInput" id="nameFilter" label="Filtrer par nom"
                 variant="outlined" onKeyUp={startCountdown} onKeyDown={() => clearTimeout(nameInputTimer)}/>
      <CategorizedAutocompleteChecklist items={cardSetFilter} placeholder={"Trier par sets"}
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
  )

}
