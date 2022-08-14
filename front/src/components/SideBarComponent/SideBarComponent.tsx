import React, {useContext} from "react";
import {Tooltip} from "@mui/material";
import {CardSerie, CardSet} from "../../../../api/src/database";
import {SideBarComponentPropsType} from "../../../typing/types";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import './SideBarComponent.scss';

export const SideBarComponent: React.FC<SideBarComponentPropsType> = ({series}) => {
  const {cardSetFilter, setCardSetFilter, resetAllFilters} = useContext(CardManagerContext);

  const activateSetFilter = (setCode: string) => {
    resetAllFilters();
    setCardSetFilter(cardSetFilter.map((setFilter) => {
      setFilter.status = (setFilter.id === setCode);
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
        {
          series.map((serie) => (
            <div className={getSerieClassname(serie)} key={serie.code}>
              <div className="SideBar-serieName" onClick={() => activateSerie(serie)}>{serie.name}</div>
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
      <div className="SideBar-hover"/>
    </>
  )

}
