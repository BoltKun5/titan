import React, {useContext} from "react";
import {Tooltip} from "@mui/material";
import {CardSet} from "../../../../api/src/database";
import {SideBarComponentPropsType} from "../../../typing/types";
import CardManagerContext from "../../contexts/CardManagerContext";
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

  return (
    <div className="SideBar">
      {
        series.map((serie) => (
          <div className="SideBar-serie" key={serie.code}>
            <div className="SideBar-serieName">{serie.name}</div>
            <div className="SideBar-setList">
              {serie.cardSets.map((set: CardSet) => (
                <div
                  className="SideBar-setElement"
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
  )

}
