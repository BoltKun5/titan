import React, {useContext} from "react";
import {SingleCardOverlayContentComponentPropsType} from "../../typing/types";
import CardManagerContext from "../contexts/CardManagerContext";
import {CardCounterComponent} from "./CardCounterComponent";

export const SingleCardOverlayContentComponent: React.FC<SingleCardOverlayContentComponentPropsType> = ({
                                                                                                          card,
                                                                                                          index,
                                                                                                          firstType,
                                                                                                        }) => {
  const {separateReverse} = useContext(CardManagerContext);

  return (
    <div key={"content" + card.localId + index} className="Collection-Card-overlayBottom">
      <div className="Collection-Card-overlayBottom-content">
        <CardCounterComponent label={firstType === 'classic' ? "Carte normale" : "Carte reverse"} type={firstType}
                              card={card}/>
        {(!separateReverse && card.canBeReverse) &&
        <CardCounterComponent card={card} label={'Carte reverse'} type={'reverse'}/>}
      </div>
    </div>
  )
}
