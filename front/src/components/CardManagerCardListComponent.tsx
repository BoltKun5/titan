import React, {useContext} from "react";
import CardManagerContext from "../contexts/CardManagerContext";
import {SingleCardComponent} from "./SingleCardComponent";

export const CardManagerCardListComponent: React.FC = () => {
  const {cards, collectionMode, separateReverse} = useContext(CardManagerContext);

  return (
    <div className="Manager-cardList">
      <div className="Collection-CardList">
        {cards.map((card: any, index) =>
          <>
            <SingleCardComponent firstType={'classic'} card={card} index={index}/>
            {collectionMode && separateReverse && card.canBeReverse && <SingleCardComponent firstType={'reverse'} card={card} index={index}/>}
          </>,
        )}
      </div>
    </div>
  )

}
