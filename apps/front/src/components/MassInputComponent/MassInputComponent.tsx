import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./style.scss";
import { CardCounterComponent } from "../CardCounterComponent/CardCounterComponent";
import { ClickAwayListener } from "@mui/material";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import { getImageSource } from "../../general.utils";
import StoreContext from "../../hook/contexts/StoreContext";
import { ICard } from "vokit_core";
import useWindowDimensions from "../../hook/utils/useWindowDimensions";

export const MassInputComponent: React.FC<{}> = () => {
  const { cards, setMassInput, massInput } = useContext(StoreContext);
  const [currentCard, setCurrentCard] = useState<ICard | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentType, setCurrentType] = useState<"classic" | "reverse">(
    "classic"
  );

  const { width } = useWindowDimensions();

  const firstInput = useRef<HTMLInputElement>(null);
  const secondInput = useRef<HTMLInputElement>(null);

  const manageKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const input = document.activeElement;
      // @ts-ignore
      input.blur();
      if (
        currentType === "classic" &&
        currentCard &&
        currentCard.canBeReverse
      ) {
        setCurrentType("reverse");
        secondInput.current?.querySelector("input")?.focus();
        secondInput.current?.querySelector("input")?.select();
        return;
      }
      if (currentIndex === cards.length - 1) {
        setMassInput(false);
        return;
      }
      setCurrentType("classic");
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", manageKeyPress);
    return () => {
      document.removeEventListener("keydown", manageKeyPress);
    };
  });

  useLayoutEffect(() => {
    return () => {
      setTimeout(() => {
        firstInput.current?.querySelector("input")?.focus();
        firstInput.current?.querySelector("input")?.select();
      }, 100);
    };
  }, [currentIndex]);

  useEffect(() => {
    setCurrentCard(cards[currentIndex]);
  }, [currentIndex]);

  const getToNextCard = () => {
    if (currentIndex === cards.length - 1) {
      setMassInput(false);
    }
    setCurrentIndex(currentIndex + 1);
  };

  return currentCard === null ? (
    <div></div>
  ) : (
    <div className="MassInput">
      <ClickAwayListener onClickAway={() => setMassInput(false)}>
        <div className="MassInput-modale">
          <div className="MassInput-image">
            <img src={getImageSource(currentCard)} />
          </div>
          <div className="MassInput-informations MassInput-override">
            <div className="MassInput-name">{currentCard.name}</div>
            <div ref={firstInput}>
              <CardCounterComponent
                key={currentCard.cardSet.code + currentCard.localId}
                card={currentCard}
                label={"Carte normale"}
                type={"classic"}
                canBeReverse={currentCard.canBeReverse}
              />
            </div>
            {currentCard.canBeReverse && (
              <div ref={secondInput}>
                <CardCounterComponent
                  key={currentCard.cardSet.code + currentCard.localId + "r"}
                  card={currentCard}
                  label={"Carte reverse"}
                  type={"reverse"}
                  canBeReverse={currentCard.canBeReverse}
                />
              </div>
            )}
            <div onClick={() => getToNextCard()} style={{ marginTop: 10 }}>
              <ButtonComponent
                label={"Carte suivante"}
                size={160}
                height={width > 1100 ? 40 : 30}
              />
            </div>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  );
};
