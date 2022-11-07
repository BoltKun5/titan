import { loggedApi } from "../axios";
import { useContext } from "react";
import { ICard } from "../../../local-core";
import StoreContext from "./contexts/StoreContext";

export const init = (cards: any) => {
  return cards
};

const { cards, setCards } = useContext(StoreContext);

export async function reducer(state: ICard[], data: { action: string, card: ICard, values: { type: "classic" | "reverse", quantity: string } }) {
  switch (data.action) {
    case 'increment':
      state
      return;
    case 'decrement':
      return;
    case 'set':
      let classicQuantity = data.card?.userCardPossessions[0]?.classicQuantity ?? 0;
      let reverseQuantity = data.card?.userCardPossessions[0]?.reverseQuantity ?? 0;
      const regex = new RegExp('^[0-9]+$');
      if (!regex.test(String(data.values.quantity))) {
        return
      }
      if (data.values.type === 'classic') {
        if (classicQuantity === Number(data.values.quantity)) {
          return
        }
        classicQuantity = Number(data.values.quantity);
      }
      if (data.values.type === 'reverse') {
        if (reverseQuantity === Number(data.values.quantity)) {
          return
        }
        reverseQuantity = Number(data.values.quantity);
      }

      try {
        const response = await loggedApi.post(`/usercards/update`, {
          cardId: data.card.id,
          classicQuantity: classicQuantity,
          reverseQuantity: reverseQuantity,
        });
        return state.map((localCard) => {
          if (data.card.id === localCard.id) {
            localCard.userCardPossessions[0] = response.data.data.result;
          }
          return localCard;
        });
      } catch (e) {
        console.log(e)
      }
      break;
    default:
      throw new Error();
  }
}


export const setQuantity = async (card: any, cardType: string, element: EventTarget & HTMLInputElement) => {
  let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
  let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
  const regex = new RegExp('^[0-9]+$');
  if (!regex.test(element.value)) {
    element.style.backgroundColor = 'red';
    return
  }
  element.style.backgroundColor = 'white';

  if (cardType === 'classic') {
    if (classicQuantity === Number(element.value)) {
      return
    }
    classicQuantity = element.value;
  }
  if (cardType === 'reverse') {
    if (reverseQuantity === Number(element.value)) {
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
