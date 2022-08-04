import React, {useContext} from "react";
import {Tooltip} from "@mui/material";
import {CardSet} from "../../../api/src/database";
import {SideBareComponentPropsType} from "../../typing/types";
import CardManagerContext from "../contexts/CardManagerContext";

export const SideBarComponent: React.FC<SideBareComponentPropsType> = ({series}) => {
  const {cardSetFilter, setCardSetFilter, resetAllFilters} = useContext(CardManagerContext);

  const activateSetFilter = (setCode: string) => {
    resetAllFilters();
    setCardSetFilter(cardSetFilter.map((setFilter) => {
      setFilter.status = (setFilter.id === setCode);
      return setFilter
    }))
  }

  return (
    <div className="Manager-leftBar">
      {
        series.map((serie) => (
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
  )

}
