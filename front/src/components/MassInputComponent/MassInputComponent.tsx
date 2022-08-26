import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import './MassInputComponent.scss';
import {CardCounterComponent} from "../CardCounterComponent/CardCounterComponent";
import {ClickAwayListener} from "@mui/material";
import {Card} from "../../../../api/src/database";

export const MassInputComponent: React.FC<{}> = () => {
  const {cards, setMassInput, massInput} = useContext(CardManagerContext);
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentType, setCurrentType] = useState<"classic" | "reverse">("classic")

  const manageKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      const input = document.activeElement;
      // @ts-ignore
      input.blur();
      // @ts-ignore
      if (currentType === "classic" && currentCard && canBeReverse(currentCard)) {
        setCurrentType("reverse");
        const secondInput: HTMLInputElement | null = document.querySelector(".MassInput-informations .CardCounter:last-of-type input");
        secondInput?.focus();
        secondInput?.select();
        return
      }
      if (currentIndex === cards.length - 1) {
        setMassInput(false);
        return
      }
      setCurrentType("classic");
      setCurrentIndex(currentIndex + 1);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", manageKeyPress)
    return () => {
      document.removeEventListener("keydown", manageKeyPress);
    }
  });

  useLayoutEffect(() => {
    return () => {
      setTimeout(() => {
        const input: HTMLInputElement | null = document.querySelector(".MassInput-informations input");
        if (input) {
          input.focus();
          input.select();
        }
      }, 100)

    }
  }, [currentIndex])

  useEffect(() => {
    setCurrentCard(cards[currentIndex]);
  }, [currentIndex])

  const getToNextCard = () => {
    if (currentIndex === cards.length - 1) {
      setMassInput(false);
    }
    setCurrentIndex(currentIndex + 1)
  }

  return currentCard === null ? (
    <div>

    </div>
  ) : (
    <div className="MassInput">
      <ClickAwayListener onClickAway={() => setMassInput(false)}>
        <div className="MassInput-modale">
          <div className="MassInput-image">
            <img src={"src/assets/cards/" + currentCard.cardSet.code + "/" + Number(currentCard.localId) + ".jpg"}/>
          </div>
          <div className="MassInput-informations MassInput-overrideCounter">
            <div className="MassInput-name">{currentCard.name}</div>
            <CardCounterComponent key={currentCard.cardSet.code + currentCard.localId} card={currentCard}
                                  label={"Carte normale"} type={"classic"}/>
            {currentCard.canBeReverse &&
            <CardCounterComponent key={currentCard.cardSet.code + currentCard.localId + "r"} card={currentCard}
                                  label={"Carte reverse"} type={"reverse"}/>}
            <button className="MassInput-button" onClick={() => getToNextCard()}>Carte suivante
            </button>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  )
}
