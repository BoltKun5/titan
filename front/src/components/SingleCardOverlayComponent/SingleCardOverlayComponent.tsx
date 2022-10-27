import React, { useContext } from "react";
import { SingleCardOverlayComponentPropsType } from "../../../../local-core";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import { CardCounterComponent } from "../CardCounterComponent/CardCounterComponent";
import './style.scss'

export const SingleCardOverlayComponent: React.FC<SingleCardOverlayComponentPropsType> = ({ card, index, firstType }) => {
  const { separateReverse } = useContext(CardManagerContext);

  return (
    <>
      <div key={"overlay" + card.localId + index} className="SingleCardOverlay">
        <div className="SingleCardOverlay-content">
          <CardCounterComponent label={firstType === 'classic' ? "Carte normale" : "Carte reverse"} type={firstType}
            card={card} canBeReverse={card.canBeReverse} />
          {(!separateReverse) &&
            <CardCounterComponent canBeReverse={card.canBeReverse} card={card} label={'Carte reverse'} type={'reverse'} />}
        </div>
      </div>
    </>
  )
}
