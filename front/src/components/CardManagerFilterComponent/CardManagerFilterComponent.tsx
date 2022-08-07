import React, {useContext} from "react";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import CardManagerContext from "../../contexts/CardManagerContext";
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

  let nameInputTimer: string | number | NodeJS.Timeout | undefined;

  const startCountdown = (event: any) => {
    clearTimeout(nameInputTimer);
    nameInputTimer = setTimeout(() => {
      setNameFilter(event.target.value);
    }, 300);
  }

  return (
    <div className="CardManagerFilter">
      <TextField className="CardManagerFilter-textInput" id="nameFilter" label="Filtrer par nom"
                 variant="outlined" onKeyUp={startCountdown} onKeyDown={() => clearTimeout(nameInputTimer)}/>
      <CategorizedAutocompleteChecklist items={cardSetFilter} placeholder={"Trier par sets"}
                                        onFilterChange={updateSetFilters}/>
      <SwitchInputComponent
        value={collectionMode}
        isDisabled={false}
        modifyValue={setCollectionMode}
        label={'Activer le mode Collection'}
        id={'collectionMode'}
      />
      <SwitchInputComponent
        value={separateReverse}
        isDisabled={!collectionMode}
        modifyValue={setSeparateReverse}
        label={'Séparer les cartes Reverse'}
        id={'separateReverse'}
      />
      <SwitchInputComponent
        value={showUnowned}
        isDisabled={!collectionMode}
        modifyValue={setShowUnowned}
        label={'Afficher les cartes non possédées'}
        id={'showUnowned'}
      />
      <div className="CardManagerFilter-selectInput">
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
