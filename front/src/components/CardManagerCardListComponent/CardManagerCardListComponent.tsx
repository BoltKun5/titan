import React, {useContext} from "react";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import {SingleCardComponent} from "../SingleCardComponent/SingleCardComponent";
import './CardManagerCardListComponent.scss'
import {Card} from "../../../../api/src/database";

export const notReverseRarities = [1, 3, 5, 6]

export const canBeReverse = (card: Card) => {
  if (card.cardSet.code === 'CEL') return card.canBeReverse
  return !notReverseRarities.includes(card.rarity)
}

export const CardManagerCardListComponent: React.FC = () => {
  const {cards, collectionMode, separateReverse} = useContext(CardManagerContext);
  return (
    <div className="CardManagerCardList">

      <div className="CardManagerCardList-grid">
        {cards.map((card: any, index) =>
          <React.Fragment key={"firstCard" + card.localId + "0" + index}>
            <SingleCardComponent firstType={'classic'} card={card} index={index}/>
            {collectionMode && separateReverse && canBeReverse(card) &&
            <SingleCardComponent firstType={'reverse'} card={card} index={index}/>}
          </React.Fragment>,
        )}
      </div>
    </div>
  )

}
