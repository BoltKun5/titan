import React, {useContext} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
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
    massInput
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
      <div className="CardManagerFilter-left">
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

        </div>
        <div className="CardManagerFilter-bottom">
          <button className="CardManagerFilter-button" onClick={resetAllFilters}>Réinitialiser
            filtres</button>
          {collectionMode && <button className="CardManagerFilter-button" onClick={() => setMassInput(true)}>Entrer toutes les valeurs</button>}
        </div>
      </div>

      <div className="CardManagerFilter-switchGroup">
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
      </div>
    </div>
  )

}
