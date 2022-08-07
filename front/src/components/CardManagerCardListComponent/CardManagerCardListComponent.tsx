import React, {useContext} from "react";
import CardManagerContext from "../../contexts/CardManagerContext";
import {SingleCardComponent} from "../SingleCardComponent/SingleCardComponent";
import './CardManagerCardListComponent.scss'

export const notReverseRarities = [1, 3, 5, 6]

export const CardManagerCardListComponent: React.FC = () => {
  const {cards, collectionMode, separateReverse} = useContext(CardManagerContext);
  return (
    <div className="CardManagerCardList">
      <div className="CardManagerCardList-grid">
        {cards.map((card: any, index) =>
          <React.Fragment key={"firstCard" + card.localId + "0" + index}>
            <SingleCardComponent firstType={'classic'} card={card} index={index}/>
            {collectionMode && separateReverse && (card.canBeReverse || !notReverseRarities.includes(card.rarity)) &&
            <SingleCardComponent firstType={'reverse'} card={card} index={index}/>}
          </React.Fragment>,
        )}
      </div>
    </div>
  )

}
