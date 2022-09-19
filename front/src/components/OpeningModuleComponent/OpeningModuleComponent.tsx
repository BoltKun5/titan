import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import './OpeningModuleComponent.scss';
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import { ClickAwayListener, Tooltip } from "@mui/material";
import { CardListElement, getImageSource, initialCardList } from "../../pages/CardManager/CardManagerUtils";
import { api, loggedApi } from "../../axios";
import { useFetchData } from "../../hook/api/cards";
import { ICard } from "../../../../local-core";

export const OpeningModuleComponent: React.FC = () => {
  const { setOpeningModule, cardSetFilter } = useContext(CardManagerContext);

  const [step, setStep] = useState<'setChoice' | 'main' | 'summary' | 'end'>('setChoice');
  // NOCOMMIT :  
  const [cardSetSearch, setCardSetSearch] = useState<string>('');

  const [cardSet, setCardSet] = useState<LocalCardSet | null>(null);
  const [cardList, setCardList] = useState<CardListElement[]>(initialCardList);
  const [cardAmount, setCardAmount] = useState<number>(10);
  const [cardLocalId, setCardLocalId] = useState<string>("");
  const [preselectedCard, setPreselectedCard] = useState<ICard | null>(null);
  const [isPrevalidated, setIsPrevalidated] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isWrongId, setIsWrongId] = useState<boolean>(false);
  const [cardType, setCardType] = useState<"normal" | "reverse">("normal");
  const [possibleCards, setPossibleCards] = useState<ICard[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  const { fetch } = useFetchData();

  type LocalCardSet = {
    name: string,
    id: string,
    code: string
  }

  const setList: LocalCardSet[] = cardSetFilter.map((filter) => {
    return {
      name: filter.name,
      id: filter.id,
      code: filter.code ?? '',
    }
  })

  const manageCloseModule = () => {
    if (step !== 'end') {
      setIsConfirmationOpen(true);
    } else {
      setOpeningModule(false)
    }
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setCardSetSearch(ev.currentTarget.value);
  }

  const getFilteredSets = (set: any) => {
    return set.name.toUpperCase().includes(cardSetSearch.toUpperCase()) || set.code.toUpperCase().includes(cardSetSearch.toUpperCase())
  }



  const updateCardAmount = (value: number) => {
    setCardAmount(value)
    if (value > cardList.length) {
      let newCardList = [...cardList];
      for (let i = 0; i <= (value - cardList.length); i++) {
        newCardList.push({
          card: null,
        });
      }

      setCardList(newCardList)
    } else if (value < cardList.length) {
      setCardList(cardList.splice(0, value))
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", manageKeyPress)
    return () => {
      document.removeEventListener("keydown", manageKeyPress);
    }
  });

  useEffect(() => {
    if (cardSet === null) return
    fetch('cardlist/cards', { setFilter: cardSet?.code ?? '', order: 'default' }).then((response) => {
      setPossibleCards(response.data)
    })
  }, [cardSet])

  const processNewLocalId = () => {
    if (isPrevalidated) {
      setCardList(cardList.map((value, index) => {
        if (index === currentIndex)
          return {
            card: preselectedCard,
            type: cardType,
            ...(!preselectedCard?.canBeReverse && cardType === "reverse" ? { error: "Cette carte ne semble pas exister en reverse" } : {}),
          }
        return value
      }))
      setPreselectedCard(null);
      setIsPrevalidated(false)
      setPreselectedCard(null);
      if (currentIndex + 1 === cardAmount) {
        setStep("summary")
      }
      setCurrentIndex(currentIndex + 1);
      if (currentIndex === 7) {
        setCardType("reverse")
      } else {
        setCardType("normal")
      }
      setCardLocalId("");
      return
    }
    const goodCards = possibleCards.filter((card) => card.localId === cardLocalId)
    if (goodCards.length === 0) {
      setIsPrevalidated(false);
      setIsWrongId(true)
    } else {
      setPreselectedCard(goodCards[0]);
      setIsPrevalidated(true);
    }

  }


  const onClickHandler = (index: number, value: CardListElement) => {
    setCurrentIndex(index);
    setPreselectedCard(value.card);
    setCardLocalId(value.card?.localId ?? '');
    setCardType(value.type ?? 'normal');
    setIsPrevalidated(value.card !== null);
    setIsWrongId(false);
  }

  const manageKeyPress = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      processNewLocalId()
    }
  }

  const submit = () => {
    try {
      loggedApi.post("usercards/incrementMany", {
        cards: cardList.map((value) => ({ cardId: value.card?.id, type: value.type }))
      });
    } catch (e) {

    }
    setStep('end')
  }

  return (
    <div className="OpeningModule">
      <ClickAwayListener onClickAway={() => manageCloseModule()}>
        <div className="OpeningModule-modale">
          {isConfirmationOpen && <div className="OpeningModule-exitModale-container">
            <div className="OpeningModule-exitModale">
              <span>Les cartes ne sont ajoutées à la collection qu'une fois un booster complété. Voulez-vous quitter ?</span>
              <div className="OpeningModule-exitModale-buttonContainer">
                <button className="button" onClick={() => {
                  setOpeningModule(false)
                }}>Quitter</button>
                <button className="button" onClick={
                  () => { setIsConfirmationOpen(false) }
                }>Rester</button>
              </div>
            </div>
          </div>}
          <h1 style={{ marginLeft: 30 }}>Ouvrir un booster</h1>
          {
            step === 'setChoice' && (<div className="OpeningModule-main">
              <h3>Choisir le set du booster</h3>
              <input type={"text"} value={cardSetSearch} onChange={(ev) => handleChange(ev)} />
              <div className={"OpeningModule-setList"}>
                {
                  setList.filter(getFilteredSets).map((set) => <div key={"openingModuleSetList" + set.code}
                    className={"OpeningModule-set"}
                    onClick={() => {
                      setCardSet(set)
                      setStep('main')
                    }}>
                    <img src={`src/assets/setIcons/${set.code}.png`} />
                    <span>{set.name}</span>
                  </div>)
                }
              </div>
            </div>)
          }
          {
            step === 'main' && (<div className="OpeningModule-main">
              <div className="OpeningModule-options">
                <span>Nombre de cartes</span>
                <select style={{ marginLeft: 10 }} onChange={(event) => updateCardAmount(Number(event?.currentTarget?.value))}
                  value={cardAmount}>
                  <option value={3}>3</option>
                  <option defaultChecked={cardSet?.code === "CEL"} value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option defaultChecked={cardSet?.code !== "CEL"} value={10}>10</option>
                </select>
              </div>
              <div className={"OpeningModule-subMain"}>
                <div className="OpeningModule-valuesInput">
                  <div className={"OpeningModule-preselected"}>
                    {preselectedCard &&
                      <img src={getImageSource(preselectedCard)} />}
                  </div>

                  <input type={"text"} placeholder={"Id local de la carte"} value={cardLocalId}
                    onChange={(ev) => {
                      setCardLocalId(ev.currentTarget.value)
                      setIsPrevalidated(false);
                      setIsWrongId(false)
                    }}
                    style={{ border: isWrongId ? 'red 2px solid' : isPrevalidated ? 'green 2px solid' : 'black 2px solid' }} />
                  <div className={"OpeningModule-typeSelect"}>
                    <select onChange={(event) => setCardType(event.currentTarget.value as "normal" | "reverse")}
                      value={cardType}>
                      <option value={"normal"}>Normal</option>
                      <option value={"reverse"}>Reverse</option>
                    </select>
                    <div>
                      <button className="button" onClick={() => { processNewLocalId() }}>Valider</button>
                    </div>
                  </div>
                </div>
                <div className="OpeningModule-boosterContent">
                  {
                    cardList.map((value, index) =>
                      <div onClick={() => onClickHandler(index, value)} key={'OpeningModule-boosterContentElement' + index}
                        className={"OpeningModule-boosterContent-element " + (value.type === "reverse" ? "reverse" : "") + (value?.error ? " isError" : '')}
                        style={{ borderWidth: currentIndex === index ? 3 : 1 }}>
                        {value.error && <>
                          <div className="OpeningModule-errorMessage">{value.error}</div>
                          <div className={"OpeningModule-boosterContent-error"}>
                            <img src={"src/assets/icons/warning.png"} />
                          </div>
                        </>
                        }
                        {value.card !== null &&
                          <img src={getImageSource(value.card)} />}
                      </div>
                    )
                  }
                </div>
                <div className="OpeningModule-setCards" style={{ height: (Math.ceil(possibleCards.length / 3) * 27) }}>
                  {
                    possibleCards.map((card, index) =>
                      <div className="OpeningModule-setCard" key={"OpeningModule-setCard" + index} onClick={() => {
                        setCardLocalId(card.localId)
                        setIsWrongId(false)
                        setIsPrevalidated(true)
                        setPreselectedCard(card)
                      }}>
                        <span>{card.name}</span> <span>{card.localId}</span>
                      </div>
                    )
                  }
                </div>
              </div>

            </div>
            )
          }
          {
            step === 'summary' && (
              <div className="OpeningModule-summary">
                <h4 style={{ marginTop: 0, marginLeft: 30 }}>Les cartes suivantes vont être ajoutées :</h4>
                <div className="OpeningModule-boosterContent" style={{ width: '100%', maxWidth: 1400, padding: 0 }}>
                  {
                    cardList.map((value, index) =>
                      <div
                        className={"OpeningModule-boosterContent-element " + (value.type === "reverse" ? "reverse" : "")}
                        style={{ borderWidth: 'none', width: '18%' }}>
                        {value.error &&
                          <div className={"OpeningModule-boosterContent-error"}>
                            <img src={"src/assets/icons/warning.png"} />
                          </div>
                        }
                        {value.card !== null &&
                          <img src={getImageSource(value.card)} />}
                      </div>
                    )
                  }
                </div>
                <div className="OpeningModule-summary-buttonContainer">
                  <button className="button" onClick={() => {
                    submit()
                  }}>Valider</button>
                  <button className="button" onClick={() => {
                    setStep('main')
                    setCurrentIndex(cardList.length - 1)
                  }}>Modifier le contenu du booster</button>
                </div>
              </div>
            )
          }
          {
            step === 'end' && (<div className="OpeningModule-end">
              <h4 style={{ marginTop: 0, marginLeft: 30 }}>Les cartes suivantes ont été ajoutées à la collection</h4>
              <div className="OpeningModule-boosterContent" style={{ width: '100%', maxWidth: 1400, padding: 0 }}>
                {
                  cardList.map((value, index) =>
                    <div
                      className={"OpeningModule-boosterContent-element " + (value.type === "reverse" ? "reverse" : "")}
                      style={{ borderWidth: 'none', width: '18%' }}>
                      {value.error &&
                        <div className={"OpeningModule-boosterContent-error"}>
                          <img src={"src/assets/icons/warning.png"} />
                        </div>
                      }
                      {value.card !== null &&
                        <img src={getImageSource(value.card)} />}
                    </div>
                  )
                }
              </div>
              <div className="OpeningModule-end-buttonContainer">
                <button className="button" onClick={() => {
                  setStep('setChoice');
                  setCardList(initialCardList)
                  setCardSet(null)
                  setCardSetSearch('')
                  setCurrentIndex(0)
                }}>Ouvrir un autre booster</button>
                <button className="button" onClick={() => {
                  setStep('main')
                  setCardList(initialCardList)
                  setCurrentIndex(0)
                }}>Ouvrir un autre booster du set</button>
                <button className="button" onClick={() => setOpeningModule(false)}>Quitter</button>
              </div>
            </div>
            )
          }

        </div>
      </ClickAwayListener>
    </div>
  )
}
