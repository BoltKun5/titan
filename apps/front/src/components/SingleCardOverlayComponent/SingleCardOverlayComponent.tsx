import React, { useContext } from "react";

import StoreContext from "../../hook/contexts/StoreContext";
import { CardCounterComponent } from "../CardCounterComponent/CardCounterComponent";
import "./style.scss";
import { SingleCardOverlayComponentPropsType } from "../../local-core";

export const SingleCardOverlayComponent: React.FC<SingleCardOverlayComponentPropsType> =
  ({ card, index, firstType }) => {
    const { separateReverse } = useContext(StoreContext);

    return (
      <>
        <div
          key={"overlay" + card.localId + index}
          className="SingleCardOverlay"
        >
          <div className="SingleCardOverlay-content">
            <CardCounterComponent
              label={
                firstType === "classic" ? "Carte normale" : "Carte reverse"
              }
              type={firstType}
              card={card}
              canBeReverse={card.canBeReverse}
            />
            {!separateReverse && (
              <CardCounterComponent
                canBeReverse={card.canBeReverse}
                card={card}
                label={"Carte reverse"}
                type={"reverse"}
              />
            )}
          </div>
        </div>
      </>
    );
  };
