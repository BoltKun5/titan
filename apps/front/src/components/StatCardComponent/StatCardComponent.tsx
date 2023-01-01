import React, { useContext } from "react";
import './style.scss';

import { StatCardComponentType } from "../../../../local-core";
import StoreContext from "../../hook/contexts/StoreContext";

export const StatCardComponent: React.FC<StatCardComponentType> = ({ data }) => {
  const { showUnowned } = useContext(StoreContext);
  return (
    <div className="StatCard">
      {
        data?.icon && <div className="StatCard-icon">
          <img src={data.icon} />
        </div>
      }
      <div className="StatCard-informations">
        <div className="StatCard-values">
          <span className={"StatCard-distinctQuantity"}>{data.distinctQuantity}</span>

          <span className={"StatCard-separator"}> / </span>
          <span className={"StatCard-possibleQuantity"}>{data.possibleQuantity}</span>
          <div className="StatCard-label">
            {data.label.toLocaleUpperCase()}
          </div>


        </div>
        <span className={"StatCard-total"}>TOTAL : {data.ownedQuantity}</span>

      </div>

    </div>
  )
}
