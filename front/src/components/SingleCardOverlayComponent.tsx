import React from "react";
import {SingleCardOverlayComponentPropsType} from "../../typing/types";
import {SingleCardOverlayContentComponent} from "./SingleCardOverlayContentComponent";

export const SingleCardOverlayComponent: React.FC<SingleCardOverlayComponentPropsType> = ({card, index, firstType}) => {
  return (
    <>
      <div key={"overlay" + card.localId + index} className="Collection-Card-overlayContainer">
        <div className="Collection-Card-overlay"/>
      </div>
      <SingleCardOverlayContentComponent firstType={firstType} card={card} index={index}/>
    </>
  )
}
