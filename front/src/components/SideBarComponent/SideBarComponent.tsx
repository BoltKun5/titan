import React, {useContext} from "react";
import {Tooltip} from "@mui/material";
import {CardSerie, CardSet} from "../../../../api/src/database";
import {SideBarComponentPropsType} from "../../../typing/types";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import './SideBarComponent.scss';
import {SwitchInputComponent} from "../SwitchInputComponent/SwitchInputComponent";

export const SideBarComponent: React.FC<SideBarComponentPropsType> = ({series}) => {
  const {
    cardSetFilter,
    setCardSetFilter,
    resetAllFilters,
    collectionMode,
    setCollectionMode,
    separateReverse,
    setSeparateReverse,
    showUnowned,
    setShowUnowned,
    setMassInput,
    setShowStats,
    setOpeningModule
  } = useContext(CardManagerContext);

  const activateSetFilter = (setCode: string) => {
    resetAllFilters();
    setCardSetFilter(cardSetFilter.map((setFilter) => {
      setFilter.status = (setFilter.code === setCode);
      return setFilter
    }))
  }

  const getSerieClassname = (serie: CardSerie) => {
    if (cardSetFilter.filter((filteredElement) => (serie.code === filteredElement.categoryCode) && !filteredElement.status).length === 0) {
      return "SideBar-serie selected"
    }
    return "SideBar-serie"
  }

  const getSetClassname = (set: CardSet) => {
    const localCardSetFilter = cardSetFilter.find((filteredElement) => (set.code === filteredElement.id))
    if (localCardSetFilter?.status) {
      return "SideBar-setElement selected"
    }
    return "SideBar-setElement"
  }

  const activateSerie = (serie: CardSerie) => {
    const localCardSetFilter = cardSetFilter.map((setFilterElement) => {
      setFilterElement.status = (setFilterElement.categoryCode === serie.code);
      return setFilterElement
    });
    setCardSetFilter(localCardSetFilter);
  }

  return (
    <>
      <div className="SideBar">
        <div className="SideBar-category">

          <div className="SideBar-categoryName" onClick={(ev) => {
            ev.currentTarget.classList.toggle("isOpened")
          }}>Filtres rapides
          </div>
          <div className="SideBar-categoryContent">
            {
              series.map((serie) => (
                <div className={getSerieClassname(serie)} key={serie.code}>
                  <div className="SideBar-serieName" onClick={(ev) => {
                    ev.currentTarget.classList.toggle("isOpened")
                  }}>{serie.name}</div>
                  <div className="SideBar-setList">
                    {serie.cardSets.map((set: CardSet) => (
                      <div
                        className={getSetClassname(set)}
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

          <div className="SideBar-categoryName" onClick={(ev) => {
            ev.currentTarget.classList.toggle("isOpened")
          }}>Outils
          </div>
          <div className="SideBar-categoryContent">
            <SwitchInputComponent
              value={collectionMode}
              isDisabled={false}
              modifyValue={setCollectionMode}
              label={'Mode Collection'}
              id={'collectionMode'}
            />
            <SwitchInputComponent
              value={separateReverse}
              isDisabled={!collectionMode}
              modifyValue={setSeparateReverse}
              label={'Séparer Reverse'}
              id={'separateReverse'}
            />
            <SwitchInputComponent
              value={showUnowned}
              isDisabled={!collectionMode}
              modifyValue={setShowUnowned}
              label={'Afficher non possédées'}
              id={'showUnowned'}
            />
            <button className="SideBar-secondaryButton" disabled={!collectionMode} onClick={() => setShowStats(true)}>Voir les statistiques</button>
            <button className="SideBar-secondaryButton" disabled={!collectionMode} onClick={() => setMassInput(true)}>Entrer toutes les
              valeurs</button>
            <button className="SideBar-secondaryButton" onClick={() => setOpeningModule(true)}>Ouvrir un booster</button>
          </div>
        </div>
      </div>
    </>
  )

}
