import React, {useContext, useEffect, useState} from "react";
import {CardCounterComponentPropsType} from "../../../typing/types";
import {loggedApi} from "../../axios";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import './CardCounterComponent.scss';
import {Card} from "../../../../api/src/database";

export const CardCounterComponent: React.FC<CardCounterComponentPropsType> = ({
                                                                                card, label, type,
                                                                              }) => {
  const {setCards, cards} = useContext(CardManagerContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(getValue(card))
  }, [cards])

  const modifyQuantity = async (card: any, cardType: string, modification: string) => {
    setIsDisabled(true)
    let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
    let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
    if (cardType === 'classic' && modification === 'plus') {
      classicQuantity++;
    }
    if (cardType === 'classic' && modification === 'minus') {
      classicQuantity--;
      if (classicQuantity < 0)
        classicQuantity = 0;
    }
    if (cardType === 'reverse' && modification === 'plus') {
      reverseQuantity++;
    }
    if (cardType === 'reverse' && modification === 'minus') {
      reverseQuantity--;
      if (reverseQuantity < 0)
        reverseQuantity = 0;
    }

    try {
      const response = await loggedApi.post(`/usercards/update`, {
        cardId: card.id,
        classicQuantity: classicQuantity,
        reverseQuantity: reverseQuantity,
      });
      setIsDisabled(false)
      setCards(cards.map((localCard) => {
        if (card.id === localCard.id) {
          localCard.userCardPossessions[0] = response.data.data.result;
        }
        return localCard;
      }));
    } catch (e) {
      console.log(e)
    }
  }

  const setQuantity = async (card: any, cardType: string, element: EventTarget & HTMLInputElement) => {
    setIsDisabled(true)
    let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
    let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
    const regex = new RegExp('^[0-9]+$');
    if (!regex.test(element.value)) {
      element.style.backgroundColor = 'red';
      setIsDisabled(false)
      return
    }
    element.style.backgroundColor = 'white';

    if (cardType === 'classic') {
      if (classicQuantity === Number(element.value)) {
        setIsDisabled(false)
        return
      }
      classicQuantity = element.value;
    }
    if (cardType === 'reverse') {
      if (reverseQuantity === Number(element.value)) {
        setIsDisabled(false)
        return
      }
      reverseQuantity = element.value;
    }

    try {
      const response = await loggedApi.post(`/usercards/update`, {
        cardId: card.id,
        classicQuantity: classicQuantity,
        reverseQuantity: reverseQuantity,
      });
      setIsDisabled(false)
      setCards(cards.map((localCard) => {
        if (card.id === localCard.id) {
          localCard.userCardPossessions[0] = response.data.data.result;
        }
        return localCard;
      }));
    } catch (e) {
      console.log(e)
    }
  }

  const getValue = (card: Card) => {
    return String(
      type === 'classic' ? (card?.userCardPossessions?.[0]?.classicQuantity ?? 0) :
        (card?.userCardPossessions?.[0]?.reverseQuantity ?? 0),
    )
  }

  const changeHandler = (element: EventTarget & HTMLInputElement) => {
    setValue(element.value);
  }

  return (
    <div className="CardCounter">
      <div className="CardCounter-name">{label}</div>
      <div className="CardCounter-buttons">
        <button className="CardCounter-minus" disabled={isDisabled}
                onClick={() => modifyQuantity(card, type, 'minus')}>-
        </button>
        <input className="CardCounter-input" disabled={isDisabled}
               onBlur={(ev) => setQuantity(card, type, ev.currentTarget)} onClick={(ev) => ev.currentTarget.select()}
               value={value} type="number" onChange={(ev) => changeHandler(ev.currentTarget)}/>
        <button className="CardCounter-plus" disabled={isDisabled}
                onClick={() => modifyQuantity(card, type, 'plus')}>+
        </button>
      </div>
    </div>
  )
}
