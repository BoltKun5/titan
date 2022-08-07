import React from "react";
import {SingleCardOverlayComponentPropsType} from "../../../typing/types";
import {SingleCardOverlayContentComponent} from "../SingleCardOverlayContentComponent/SingleCardOverlayContentComponent";
import './SingleCardOverlayComponent.scss'

export const SingleCardOverlayComponent: React.FC<SingleCardOverlayComponentPropsType> = ({card, index, firstType}) => {
  return (
    <>
      <div key={"overlay" + card.localId + index} className="SingleCardOverlay-container">
        <div className="SingleCardOverlay-overlay"/>
      </div>
      <SingleCardOverlayContentComponent firstType={firstType} card={card} index={index}/>
    </>
  )
}
