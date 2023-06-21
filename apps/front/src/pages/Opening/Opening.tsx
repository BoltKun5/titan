import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import "./style.scss";
import {
  CardListElement,
  getImageSource,
  initialCardList,
} from "../../general.utils";
import { api, loggedApi } from "../../axios";
import StoreContext from "../../hook/contexts/StoreContext";
import { ButtonComponent } from "../../components/UI/Button/ButtonComponent";
import { SwipeCheckboxComponent } from "../../components/UI/SwipeCheckboxComponent/SwipeCheckboxComponent";
import { Close, Done } from "@mui/icons-material";
import { useFetchData } from "../../hook/api/cards";
import { CardAdditionalPrintingTypeEnum, ICard, ICardSerie, ICardSet } from "vokit_core";
import { ICardAdditionalPrinting } from "vokit_core/src/types/interface/models/card-additional-printing.model";
import useWindowDimensions from "../../hook/utils/useWindowDimensions";

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
  const [setList, setSetList] = useState<LocalCardSet[]>([]);
  const [isDescMobileOpen, setIsDescMobileOpen] = useState(false);

  const { width } = useWindowDimensions();

  const { fetch } = useFetchData();

  type LocalCardSet = {
    name: string;
    id: string;
    code: string;
    logoId: string;
  };

  useEffect(() => {
    if (!series) return;
    let _setList: LocalCardSet[] = [];
    series.map(
      (serie) => {
        _setList = _setList.concat(
          serie.cardSets?.map((_serie: ICardSet) => {
            return {
              name: _serie.name,
              id: _serie.id,
              code: _serie.code,
              logoId: _serie.logoId
            };
          }) ?? []
        );
      },
      [series]
    );
    setSetList(_setList);
  }, []);

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
    fetch("card/list", {
      setFilter: [cardSet?.code ?? ""],
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
      loggedApi.post("possession/multiple-create", {
        cards: cardList.map((value) => ({
          cardId: value.card?.id,
          printingId:
            value.type === "reverse"
              ? value.card?.cardAdditionalPrinting?.find(
                  (e: ICardAdditionalPrinting) =>
                    e.type === CardAdditionalPrintingTypeEnum.REVERSE
                )?.id
              : null,
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
    <div className={"OpeningPage " + "step" + step}>
      {width < 955 && (
        <div className="OpeningPage-mobileDescButton">
          <div onClick={() => setIsDescMobileOpen(true)}>
            <ButtonComponent label={"Description"} />
          </div>
        </div>
      )}
      {(width > 955 || isDescMobileOpen) && (
        <div className="OpeningPage-description coloredCorner">
          {width < 955 && (
            <div
              className="OpeningPage-closeDesc"
              onClick={() => setIsDescMobileOpen(false)}
            >
              <Close />
            </div>
          )}
          <h1>Ouvrir un booster</h1>
          <span>
            Ajoutez rapidement des cartes à votre collection en indiquant le
            contenu de vos boosters. À l'avenir, cela vous permettra également
            de faire des statistiques sur vos boosters. Entrez l'ID de vos
            cartes une par une (exemple : TG31 ou 012) puis appuyer une fois sur
            Entrer pour afficher la carte en question et une nouvelle fois pour
            valider à la prochaine. Vous pouvez aussi faire un clique gauche sur
            la bonne carte dans la liste pour l'ajouter, ou un clique droit pour
            l'ajouter en version reverse (rester appuyer sur téléphone).
          </span>
        </div>
      )}
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
                    placeholder="Nom de set"
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
                    <img
                      src={`${import.meta.env.VITE_ASSETS_URL}/user-application-file/file/download/public-access/${set.logoId}`}
                    />
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
                    placeholder="ID de carte"
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
                <div className="OpeningPage-boosterCards">
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
                </div>

                <div
                  className="OpeningPage-nextButton2"
                  onClick={() => {
                    setPreselectedCard(null);
                    setIsPrevalidated(false);
                    setCurrentIndex(0);
                    updateCardAmount(9);
                    setCardList(initialCardList);
                    setIsWrongId(false);
                    setCardLocalId("");
                    setStep(1);
                  }}
                >
                  <ButtonComponent label="Retour" size={150} height={40} />
                </div>

                <div
                  className="OpeningPage-nextButton2"
                  style={
                    cardList.filter((el) => el.card === null).length !== 0
                      ? { pointerEvents: "none" }
                      : {}
                  }
                  onClick={() => submit()}
                >
                  <ButtonComponent
                    label="Valider"
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
                      (value.type === "reverse" ? "reverseShining" : "")
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
