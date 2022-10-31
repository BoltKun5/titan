import React, { useContext } from "react";
import { Tooltip } from "@mui/material";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import './style.scss';
import { SwitchInputComponent } from "../SwitchInputComponent/SwitchInputComponent";
import { Link, useNavigate } from "react-router-dom";
import { ICardSerie, ICardSet } from "../../../../local-core";
import StoreContext from "../../hook/contexts/StoreContext";

export const SetListComponent: React.FC = () => {
  const {
    cardSetFilter,
    setCardSetFilter,
    resetAllFilters,
  } = useContext(CardManagerContext);

  const { series } = useContext(StoreContext);

  const activateSetFilter = (setCode: string) => {
    resetAllFilters();
    setCardSetFilter(cardSetFilter.map((setFilter) => {
      setFilter.status = (setFilter.code === setCode);
      return setFilter
    }))
  }

  const getSerieClassname = (serie: ICardSerie) => {
    if (cardSetFilter.filter((filteredElement: { categoryCode: string; status: any; }) => (serie.code === filteredElement.categoryCode) && !filteredElement.status).length === 0) {
      return "SetList-serie selected"
    }
    return "SetList-serie"
  }

  const getSetClassname = (set: ICardSet) => {
    const localCardSetFilter = cardSetFilter.find((filteredElement: { id: string; }) => (set.code === filteredElement.id))
    if (localCardSetFilter?.status) {
      return "SetList-setElement selected"
    }
    return "SetList-setElement"
  }

  return (
    <>
      <div className="SetList coloredCorner">
        <div className="SetList-triangleContainer">
          <div className="SetList-triangle" />
        </div>
        <div className="SetList-container">
          {
            series.map((serieElement) => (
              <div className={getSerieClassname(serieElement)} key={serieElement.code}>
                <div className="SetList-serieName">{serieElement.name}</div>
                <div className="SetList-setList">
                  {serieElement.cardSets.map((set: ICardSet) => (
                    <div
                      className={getSetClassname(set)}
                      key={set.code}
                      onClick={() => activateSetFilter(set.code)}
                    >
                      <Tooltip title={set.name}>
                        <img src={`./src/assets/setIcons/${set.code}.png`} />
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )

}
