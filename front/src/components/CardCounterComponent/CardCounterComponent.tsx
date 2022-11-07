import React, { useContext, useEffect, useState } from "react";
import { CardCounterComponentPropsType, ICard } from "../../../../local-core";
import { loggedApi } from "../../axios";

import StoreContext from "../../hook/contexts/StoreContext";
import './style.scss';

export const CardCounterComponent: React.FC<CardCounterComponentPropsType> = ({
  card, label, type, canBeReverse = true
}) => {
  const { setCards, cards } = useContext(StoreContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [changeNotificationValue, setChangeNotificationValue] = useState<number | null>(null)
  const [notifTimer, setNotifTimer] = useState<string | number | NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setValue(getValue(card))
  }, [cards])

  const modifyQuantity = async (card: any, cardType: string, modification: string) => {
    setIsDisabled(true)
    let oldValue;
    let newValue;
    let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
    let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
    if (cardType === 'classic' && modification === 'plus') {
      oldValue = classicQuantity;
      classicQuantity++;
      newValue = classicQuantity;
    }
    if (cardType === 'classic' && modification === 'minus') {
      oldValue = classicQuantity;
      classicQuantity--;
      if (classicQuantity < 0)
        classicQuantity = 0;
      newValue = classicQuantity;
    }
    if (cardType === 'reverse' && modification === 'plus') {
      oldValue = reverseQuantity;
      reverseQuantity++;
      newValue = reverseQuantity;
    }
    if (cardType === 'reverse' && modification === 'minus') {
      oldValue = reverseQuantity;
      reverseQuantity--;
      if (reverseQuantity < 0)
        reverseQuantity = 0;
      newValue = reverseQuantity;
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
      triggerChangeNotification(oldValue, newValue)
    } catch (e) {
      console.log(e)
    }
  }


  const startCountdown = () => {
    clearTimeout(notifTimer);
    setNotifTimer(setTimeout(() => {
      setChangeNotificationValue(null);
    }, 3000));
  }

  const triggerChangeNotification = async (oldValue: number, newValue: number) => {
    if (changeNotificationValue !== null) {
      setChangeNotificationValue(newValue - oldValue + changeNotificationValue)
    } else {
      setChangeNotificationValue(newValue - oldValue)
    }
    startCountdown();
  }

  const setQuantity = async (card: any, cardType: string, element: EventTarget & HTMLInputElement) => {
    setIsDisabled(true)
    let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
    let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
    const regex = new RegExp('^[0-9]+$');
    if (!regex.test(element.value)) {
      element.style.color = 'rgb(122, 28, 28)';
      setIsDisabled(false)
      return
    }
    element.style.color = 'rgb(201, 201, 201)';
    let oldValue;

    if (cardType === 'classic') {
      if (classicQuantity === Number(element.value)) {
        setIsDisabled(false)
        return
      }
      oldValue = classicQuantity;
      classicQuantity = element.value;
    }
    if (cardType === 'reverse') {
      if (reverseQuantity === Number(element.value)) {
        setIsDisabled(false)
        return
      }
      oldValue = reverseQuantity;
      reverseQuantity = element.value;
    }

    try {
      const response = await loggedApi.post(`/usercards/update`, {
        cardId: card.id,
        classicQuantity: classicQuantity,
        reverseQuantity: reverseQuantity,
      });
      triggerChangeNotification(Number(oldValue), Number(cardType === 'classic' ? classicQuantity : reverseQuantity))
      setCards(cards.map((localCard) => {
        if (card.id === localCard.id) {
          localCard.userCardPossessions[0] = response.data.data.result;
        }
        return localCard;
      }));
    } catch (e) {
      console.log(e)
    } finally {
      setIsDisabled(false)
    }
  }

  const getValue = (card: ICard) => {
    return String(
      type === 'classic' ? (card?.userCardPossessions?.[0]?.classicQuantity ?? 0) :
        (card?.userCardPossessions?.[0]?.reverseQuantity ?? 0),
    )
  }

  const changeHandler = (element: EventTarget & HTMLInputElement) => {
    setValue(element.value);
  }

  return (
    canBeReverse && type === "reverse" || type !== "reverse" ? (
      <div className={"CardCounter"}>
        <div className="CardCounter-name">{label}</div>
        <div className="CardCounter-buttons">
          <button className="CardCounter-minus" disabled={isDisabled}
            onClick={() => modifyQuantity(card, type, 'minus')}>-
          </button>
          <div className="CardCounter-inputContainer">
            <input className="CardCounter-input" disabled={isDisabled}
              onBlur={(ev) => setQuantity(card, type, ev.currentTarget)} onClick={(ev) => ev.currentTarget.select()}
              value={value} type="number" onChange={(ev) => changeHandler(ev.currentTarget)} />
          </div>
          <button className="CardCounter-plus" disabled={isDisabled}
            onClick={() => modifyQuantity(card, type, 'plus')}>+
          </button>
          {((changeNotificationValue !== 0) && changeNotificationValue) &&
            <div className={"CardCounter-diffNotif " + ((changeNotificationValue > 0) ? 'isPositive' : 'isNegative')}>{changeNotificationValue > 0 ? '+' : ''}{changeNotificationValue}</div>}
        </div>
      </div>
    ) :
      <div className="CardCounter-unusable">
        <div className="CardCounter-name">{label}</div>
        <div className="CardCounter-unusableMessage">N'existe pas en reverse</div>
      </div>

  )
}
