import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./style.scss";

import { ClickAwayListener, Tooltip } from "@mui/material";
import {
  CardListElement,
  getImageSource,
  initialCardList,
} from "../../pages/CardManager/CardManagerUtils";
import { api, loggedApi } from "../../axios";
import { ICard } from "../../../../local-core";
import StoreContext from "../../hook/contexts/StoreContext";
import { ButtonComponent } from "../../components/UI/Button/ButtonComponent";
import { SwipeCheckboxComponent } from "../../components/UI/SwipeCheckboxComponent/SwipeCheckboxComponent";
import { Done } from "@mui/icons-material";
import { useFetchData } from "../../hook/api/cards";

export const Opening: React.FC = () => {
  const { series } = useContext(StoreContext);

  const [step, setStep] = useState(1);
  const [cardSetSearch, setCardSetSearch] = useState<string>("");

  const [cardSet, setCardSet] = useState<LocalCardSet | null>(null);
  const [cardList, setCardList] = useState<CardListElement[]>(initialCardList);
  const [cardAmount, setCardAmount] = useState<number>(9);
  const [cardLocalId, setCardLocalId] = useState<string>("");
  const [preselectedCard, setPreselectedCard] = useState<ICard | null>(null);
  const [isPrevalidated, setIsPrevalidated] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isWrongId, setIsWrongId] = useState<boolean>(false);
  const [cardType, setCardType] = useState<"normal" | "reverse">("normal");
  const [possibleCards, setPossibleCards] = useState<ICard[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [setList, setSetList] = useState<LocalCardSet[]>([]);

  const { fetch } = useFetchData();

  type LocalCardSet = {
    name: string;
    id: string;
    code: string;
  };

  useEffect(() => {
    if (!series) return;
    let _setList: LocalCardSet[] = [];
    series.map(
      (serie) => {
        _setList = _setList.concat(
          serie.cardSets.map((_serie) => {
            return {
              name: _serie.name,
              id: _serie.id,
              code: _serie.code,
            };
          })
        );
      },
      [series]
    );
    setSetList(_setList);
  });

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setCardSetSearch(ev.currentTarget.value);
  };

  const getFilteredSets = (set: any) => {
    return (
      set.name.toUpperCase().includes(cardSetSearch.toUpperCase()) ||
      set.code.toUpperCase().includes(cardSetSearch.toUpperCase())
    );
  };

  const updateCardAmount = (value: number) => {
    setCardAmount(value);
    if (value + 1 > cardList.length) {
      let newCardList = [...cardList];
      for (let i = 0; i <= value - cardList.length; i++) {
        newCardList.push({
          card: null,
        });
      }

      setCardList(newCardList);
    } else if (value + 1 < cardList.length) {
      setCardList(cardList.splice(0, value + 1));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", manageKeyPress);
    return () => {
      document.removeEventListener("keydown", manageKeyPress);
    };
  });

  useEffect(() => {
    if (cardSet === null) return;
    fetch("cardlist/cards", {
      setFilter: cardSet?.code ?? "",
      order: "default",
      page: -1,
    }).then((response) => {
      setPossibleCards(response.data.cards);
    });
  }, [cardSet]);

  const processNewLocalId = () => {
    if (isPrevalidated) {
      if (!preselectedCard?.canBeReverse && cardType === "reverse") {
        setCardType("normal");
        return;
      }
      setCardList(
        cardList.map((value, index) => {
          if (index === currentIndex)
            return {
              card: preselectedCard,
              type: cardType,
              ...(!preselectedCard?.canBeReverse && cardType === "reverse"
                ? { error: "Cette carte ne semble pas exister en reverse" }
                : {}),
            };
          return value;
        })
      );
      setPreselectedCard(null);
      setIsPrevalidated(false);
      setPreselectedCard(null);
      if (currentIndex + 1 === cardAmount) {
        setStep(3);
      }
      setCurrentIndex(currentIndex + 1);
      if (currentIndex === 7) {
        setCardType("reverse");
      } else {
        setCardType("normal");
      }
      setCardLocalId("");
      return;
    }
    const goodCards = possibleCards.filter(
      (card) => card.localId === cardLocalId
    );
    if (goodCards.length === 0) {
      setIsPrevalidated(false);
      setIsWrongId(true);
    } else {
      setPreselectedCard(goodCards[0]);
      setIsPrevalidated(true);
    }
  };

  const onClickHandler = (index: number, value: CardListElement) => {
    setCurrentIndex(index);
    setPreselectedCard(value.card);
    setCardLocalId(value.card?.localId ?? "");
    setCardType(value.type ?? "normal");
    setIsPrevalidated(value.card !== null);
    setIsWrongId(false);
  };

  const manageKeyPress = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      processNewLocalId();
    }
  };

  const submit = () => {
    try {
      loggedApi.post("usercards/incrementMany", {
        cards: cardList.map((value) => ({
          cardId: value.card?.id,
          type: value.type,
        })),
      });
    } catch (e) {}
    setStep(3);
  };

  const swipeCheckboxAmountElements = [
    {
      name: "3",
      value: 2,
    },
    {
      name: "4",
      value: 3,
    },
    {
      name: "5",
      value: 4,
    },
    {
      name: "6",
      value: 5,
    },
    {
      name: "8",
      value: 7,
    },
    {
      name: "10",
      value: 9,
    },
  ];

  const swipeCheckboxTypeElements = [
    {
      name: "Normale",
      value: "normal",
    },
    {
      name: "Reverse",
      value: "reverse",
    },
  ];

  return (
    <div className="OpeningPage">
      <div className="OpeningPage-description coloredCorner">
        <h1>Ouvrir un booster</h1>
        <span>
          Paragraphe de description de l'outil. Lorem ipsum, dolor sit amet
          consectetur adipisicing elit. Provident mollitia incidunt asperiores
          omnis quos quod, et odio obcaecati. Eos veniam molestiae nam neque
          quis repellendus provident voluptas temporibus possimus officiis.
        </span>
      </div>
      <div className="OpeningPage-swippingArea">
        {step === 1 && (
          <div className="OpeningPage-swippingContent coloredCorner">
            <div className="OpeningPage-setChoice">
              <h2>Choisir le set du booster</h2>
              <div className="OpeningPage-flex">
                <div className="OpeningPage-setChoiceInputContainer">
                  <input
                    className="OpeningPage-setChoiceInput"
                    type={"text"}
                    value={cardSetSearch}
                    onChange={(ev) => handleChange(ev)}
                  />
                </div>
                {cardSet && <span>Selectionné : {cardSet.name}</span>}
              </div>
              <div className={"OpeningPage-setList"}>
                {setList.filter(getFilteredSets).map((set) => (
                  <div
                    key={"openingModuleSetList" + set.code}
                    className={
                      "OpeningPage-set" +
                      (set.id === cardSet?.id ? " selected" : "")
                    }
                    onClick={() => {
                      setCardSet(set);
                    }}
                  >
                    <img src={`src/assets/setIcons/${set.code}.png`} />
                    <span>{set.name}</span>
                  </div>
                ))}
              </div>
              <div
                className="OpeningPage-nextButton"
                style={!cardSet ? { pointerEvents: "none" } : {}}
                onClick={() => setStep(step + 1)}
              >
                <ButtonComponent label="Continuer" disabled={!cardSet} />
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="OpeningPage-swippingContent swipping2">
            <div className="OpeningPage-boosterContentInput">
              <div className="OpeningPage-boosterContent-features coloredCorner">
                <div
                  style={{ margin: "25px 10px 10px 10px", flex: "0 0 auto" }}
                >
                  <SwipeCheckboxComponent
                    callback={updateCardAmount}
                    elements={swipeCheckboxAmountElements}
                    value={cardAmount}
                    width={50}
                    label={"Taille"}
                  />
                </div>
                <div className={"OpeningPage-preselected"}>
                  <div
                    className={
                      "OpeningPage-preselectedImgContainer " +
                      (preselectedCard && cardType === "reverse"
                        ? "reverseShining"
                        : "")
                    }
                    style={{ borderColor: preselectedCard ? "none" : "" }}
                  >
                    {preselectedCard && (
                      <img src={getImageSource(preselectedCard)} />
                    )}
                  </div>
                </div>
                <div className="OpeningPage-boosterContent-textInput">
                  <input
                    type={"text"}
                    value={cardLocalId}
                    onChange={(ev) => {
                      setCardLocalId(ev.currentTarget.value);
                      setIsPrevalidated(false);
                      setIsWrongId(false);
                    }}
                    style={{ color: isWrongId ? "rgb(122, 28, 28)" : "" }}
                  />
                </div>
                <div className={"OpeningPage-typeSelect"}>
                  <SwipeCheckboxComponent
                    callback={setCardType}
                    elements={swipeCheckboxTypeElements}
                    value={cardType}
                    width={100}
                  />
                  <div>
                    <div
                      className="OpeningPage-boosterContent-validate"
                      onClick={() => {
                        processNewLocalId();
                      }}
                    >
                      <Done />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="OpeningPage-boosterContentOthers">
              <div className="OpeningPage-boosterContent coloredCorner">
                {cardList.map((value, index) => (
                  <div
                    onClick={() => onClickHandler(index, value)}
                    key={"OpeningPage-boosterContentElement" + index}
                    className={
                      "OpeningPage-boosterContent-element " +
                      (value.type === "reverse" ? "reverseShining" : "")
                    }
                    style={{
                      border:
                        currentIndex === index
                          ? "rgb(59, 153, 241) 2px solid"
                          : "",
                    }}
                  >
                    {value.card !== null && (
                      <img src={getImageSource(value.card)} />
                    )}
                  </div>
                ))}

                <div
                  className="OpeningPage-nextButton2"
                  onClick={() => {
                    setStep(1);
                    setPreselectedCard(null);
                    setIsPrevalidated(false);
                    setCardList(initialCardList);
                    setIsWrongId(false);
                    setCardLocalId("");
                  }}
                >
                  <ButtonComponent label="Retour" size={150} height={40} />
                </div>

                <div
                  className="OpeningPage-nextButton2"
                  style={
                    cardList.filter((el) => el.card === null).length !== 0
                      ? { pointerEvents: "none", marginLeft: 10 }
                      : { marginLeft: 10 }
                  }
                  onClick={() => submit()}
                >
                  <ButtonComponent
                    label="Continuer"
                    disabled={
                      cardList.filter((el) => el.card === null).length !== 0
                    }
                    size={150}
                    height={40}
                  />
                </div>
              </div>

              <div className="OpeningPage-possibleCardsContainer ">
                <div className="OpeningPage-possibleCards coloredCorner">
                  {possibleCards.map((card, index) => (
                    <div
                      className="OpeningPage-possibleCard"
                      key={"OpeningPage-setCard" + index}
                      onClick={() => {
                        setCardLocalId("");
                        setIsWrongId(false);
                        setIsPrevalidated(false);
                        setPreselectedCard(null);
                        setCardList(
                          cardList.map((value, index) => {
                            if (index === currentIndex)
                              return {
                                card: card,
                                type: "normal",
                              };
                            return value;
                          })
                        );
                        setCurrentIndex(
                          currentIndex + 1 < cardList.length
                            ? currentIndex + 1
                            : currentIndex
                        );
                      }}
                      onContextMenu={(ev) => {
                        ev.preventDefault();
                        if (!card.canBeReverse) return;
                        setCardLocalId("");
                        setIsWrongId(false);
                        setIsPrevalidated(false);
                        setPreselectedCard(null);
                        setCardList(
                          cardList.map((value, index) => {
                            if (index === currentIndex)
                              return {
                                card: card,
                                type: "reverse",
                              };
                            return value;
                          })
                        );
                        setCurrentIndex(
                          currentIndex + 1 < cardList.length
                            ? currentIndex + 1
                            : currentIndex
                        );
                      }}
                    >
                      <img src={getImageSource(card)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="OpeningPage-swippingContent">
            <div className="OpeningPage-end coloredCorner">
              <h2>Les cartes suivantes ont été ajoutées à la collection</h2>
              <div className="OpeningPage-addedCards">
                {cardList.map((value, index) => (
                  <div
                    className={
                      "OpeningPage-addedCard " +
                      (value.type === "reverse" ? "reverse" : "")
                    }
                  >
                    <img src={getImageSource(value.card as ICard)} />
                  </div>
                ))}
              </div>
              <div className="OpeningPage-end-buttonContainer">
                <div
                  onClick={() => {
                    setStep(1);
                    setCardList(initialCardList);
                    setCardSet(null);
                    setCardSetSearch("");
                    setCurrentIndex(0);
                  }}
                >
                  <ButtonComponent label="Ouvrir un autre booster" size={350} />
                </div>
                <div
                  onClick={() => {
                    setStep(2);
                    setCardList(initialCardList);
                    setCurrentIndex(0);
                  }}
                >
                  <ButtonComponent
                    label="Ouvrir un booster du même set"
                    size={350}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
