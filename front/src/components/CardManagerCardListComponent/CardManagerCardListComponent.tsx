import { Settings } from "@mui/icons-material";
import React, { useContext } from "react";

import StoreContext from "../../hook/contexts/StoreContext";
import { MassInputComponent } from "../MassInputComponent/MassInputComponent";
import { SingleCardComponent } from "../SingleCardComponent/SingleCardComponent";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import './style.scss';

export const CardManagerCardListComponent: React.FC = () => {
  const { cards, collectionMode, separateReverse, showOptionCards, massInput, setMassInput } = useContext(StoreContext);

  const optionCards = [
    {
      name: "Entrer toutes les valeurs",
      desc: "Ceci est une description succinte de cet outil.",
      function: setMassInput,
      value: massInput,
      component: <MassInputComponent />
    }
  ];



  return (
    <div className="CardManagerCardList">

      <div className="CardManagerCardList-grid">
        {showOptionCards && collectionMode && optionCards.map((optionCard) => <div className={"CardManagerCardList-optionCard" + (optionCard.value ? "Opened" : "")} key={optionCard.name}>
          <div className="CardManagerCardList-optionCardContent" onClick={() => optionCard.function(true)}>
            <div className="CardManagerCardList-optionCardName">{optionCard.name}</div>
            <div className="CardManagerCardList-optionCardLogo">
              {!optionCard.value ? <Settings /> : optionCard.component}
            </div>
            {optionCard.value ? <div className="CardManagerCardList-optionCardClose" onClick={() => optionCard.function(false)}>
              <ButtonComponent label="Fermer" />
            </div>
              : <div className="CardManagerCardList-optionCardDesc">{optionCard.desc}</div>}
          </div>
        </div>)
        }
        {cards.map((card: any, index: number) =>
          <React.Fragment key={"firstCard" + card.localId + "0" + index}>
            <SingleCardComponent firstType={'classic'} card={card} index={index} />
            {collectionMode && separateReverse && card.canBeReverse &&
              <SingleCardComponent firstType={'reverse'} card={card} index={index} />}
          </React.Fragment>,
        )}
      </div>
    </div>
  )

}
