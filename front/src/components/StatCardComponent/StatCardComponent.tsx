import React, {useContext} from "react";
import './StatCardComponent.scss';
import {StatCardComponentType} from "../../types";
import CardManagerContext from "../../hook/contexts/CardManagerContext";

export const StatCardComponent: React.FC<StatCardComponentType> = ({data}) => {
  const {showUnowned} = useContext(CardManagerContext);
  return (
    <div className="StatCard">
      <div className="StatCard-informations">
        <div className="StatCard-values">
          <div className="StatCard-label">
            {data.label}
          </div>
          <span className={"StatCard-distinctQuantity"}>{data.distinctQuantity}</span>
          {
            showUnowned ? <>
              <span className={"StatCard-separator"}> / </span>
              <span className={"StatCard-possibleQuantity"}>{data.possibleQuantity}</span>
            </> : <span> cartes différentes</span>
          }

        </div>
        <span className={"StatCard-total"}>Total : {data.ownedQuantity}</span>

      </div>
      {
        data?.icon && <div className="StatCard-icon">
          <img src={data.icon}/>
        </div>
      }
    </div>
  )
}
