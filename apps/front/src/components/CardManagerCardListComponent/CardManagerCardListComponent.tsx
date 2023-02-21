import { Settings } from "@mui/icons-material";
import React, { useContext } from "react";

import StoreContext from "../../hook/contexts/StoreContext";
import { MassInputComponent } from "../MassInputComponent/MassInputComponent";
import { SingleCardComponent } from "../SingleCardComponent/SingleCardComponent";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import "./style.scss";
import useWindowDimensions from "../../hook/utils/useWindowDimensions";

export const CardManagerCardListComponent: React.FC = () => {
  const {
    cards,
    collectionMode,
    separateReverse,
    showOptionCards,
    massInput,
    setMassInput,
  } = useContext(StoreContext);

  const optionCards = [
    {
      name: "Entrer toutes les valeurs",
      desc: "Entrez rapidement les quantités pour toutes vos cartes en appuyant sur Entrer pour passer à la valeur suivante ou en utilisant les boutons disponibles.",
      function: setMassInput,
      value: massInput,
      component: <MassInputComponent />,
    },
  ];

  const { width } = useWindowDimensions();

  return (
    <div className="CardManagerCardList">
      <div className="CardManagerCardList-grid">
        {showOptionCards &&
          collectionMode &&
          optionCards.map((optionCard) => (
            <div
              className={
                "CardManagerCardList-optionCard" +
                (optionCard.value ? "Opened" : "")
              }
              key={optionCard.name}
            >
              <div
                className="CardManagerCardList-optionCardContent"
                onClick={() => optionCard.function(true)}
              >
                <div className="CardManagerCardList-optionCardName">
                  {optionCard.name}
                </div>
                <div className="CardManagerCardList-optionCardLogo">
                  {!optionCard.value ? <Settings /> : optionCard.component}
                </div>
                {optionCard.value ? (
                  <div
                    className="CardManagerCardList-optionCardClose"
                    onClick={() => optionCard.function(false)}
                  >
                    <ButtonComponent
                      label="Fermer"
                      size={width > 1100 ? 125 : 90}
                      height={width > 1100 ? 40 : 25}
                    />
                  </div>
                ) : (
                  <div className="CardManagerCardList-optionCardDesc">
                    {optionCard.desc}
                  </div>
                )}
              </div>
            </div>
          ))}
        {cards.map((card: any, index: number) => (
          <React.Fragment key={"firstCard" + card.localId + "0" + index}>
            <SingleCardComponent
              firstType={"classic"}
              card={card}
              index={index}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
