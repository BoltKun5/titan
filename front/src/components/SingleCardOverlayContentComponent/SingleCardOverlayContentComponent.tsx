import React, {useContext} from "react";
import {SingleCardOverlayContentComponentPropsType} from "../../types";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import {CardCounterComponent} from "../CardCounterComponent/CardCounterComponent";
import {canBeReverse, notReverseRarities} from "../CardManagerCardListComponent/CardManagerCardListComponent";
import './SingleCardOverlayContentComponent.scss'

export const SingleCardOverlayContentComponent:
  React.FC<SingleCardOverlayContentComponentPropsType>
  = ({
       card,
       index,
       firstType,
     }) => {
  const {separateReverse} = useContext(CardManagerContext);

  return (
    <div key={"content" + card.localId + index} className="SingleCardOverlayContent-container">
      <div className="SingleCardOverlayContent-content">
        <CardCounterComponent label={firstType === 'classic' ? "Carte normale" : "Carte reverse"} type={firstType}
                              card={card}/>
        {(!separateReverse && card.canBeReverse) &&
        <CardCounterComponent card={card} label={'Carte reverse'} type={'reverse'}/>}
      </div>
    </div>
  )
}
