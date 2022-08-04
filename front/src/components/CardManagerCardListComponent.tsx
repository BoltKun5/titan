import React, {useContext} from "react";
import CardManagerContext from "../contexts/CardManagerContext";
import {UserCardPossession} from "../../../api/src/database/models/UserCardPossession";
import {loggedApi} from "../axios";

export const CardManagerCardListComponent: React.FC<{}> = () => {
  const {
    collectionMode,
    separateReverse,
    setCards,
    cards
  } = useContext(CardManagerContext);

  const getColorClassname = (userCardPossession: UserCardPossession, reverseOnly: boolean = false, canBeReverse: boolean = true) => {
    if (reverseOnly) return (userCardPossession?.reverseQuantity < 1 ? 'CardQuantity-notOwned' : 'CardQuantity-owned');
    if (!canBeReverse || (separateReverse && !reverseOnly)) return (userCardPossession?.classicQuantity < 1 ? 'CardQuantity-notOwned' : 'CardQuantity-owned');

    if (userCardPossession?.reverseQuantity < 1 && userCardPossession?.classicQuantity < 1) {
      return 'CardQuantity-notOwned';
    }
    if (userCardPossession?.reverseQuantity > 0 && userCardPossession?.classicQuantity > 0) {
      return 'CardQuantity-notOwned';
    }
    if (userCardPossession?.reverseQuantity > 0 && userCardPossession?.classicQuantity < 1) {
      return 'CardQuantity-onlyReverse'
    }
    if (userCardPossession?.classicQuantity > 0 && userCardPossession?.reverseQuantity < 1) {
      return 'CardQuantity-onlyClassic'
    }
    return ""
  }

  const modifyQuantity = async (card: any, cardType: string, modification: string, element: EventTarget & HTMLButtonElement) => {
    element.setAttribute("disabled", "true")
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
      element.removeAttribute("disabled");
      setCards(cards.map((localCard) => {
        if (card.id === localCard.id) {
          localCard.userCardPossessions[0] = response.data.data.result;
        }
        return localCard;
      }));
      console.log(cards);
    } catch (e) {
      console.log(e)
    }
  }

  const setQuantity = async (card: any, cardType: string, element: EventTarget & HTMLInputElement) => {
    element.setAttribute("disabled", "true")
    let classicQuantity = card?.userCardPossessions[0]?.classicQuantity ?? 0;
    let reverseQuantity = card?.userCardPossessions[0]?.reverseQuantity ?? 0;
    const regex = new RegExp('^[0-9]+$');
    if (!regex.test(element.value)) {
      element.style.backgroundColor = 'red';
      element.removeAttribute("disabled");
      return
    }
    element.style.backgroundColor = 'white';

    if (cardType === 'classic') {
      if (classicQuantity === Number(element.value)) {
        element.removeAttribute("disabled");
        return
      }
      classicQuantity = element.value;
    }
    if (cardType === 'reverse') {
      if (reverseQuantity === Number(element.value)) {
        element.removeAttribute("disabled");
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
      element.removeAttribute("disabled");
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

  return (
    <div className="Manager-cardList">
      <div className="Collection-CardList">
        {cards.map((card: any, index) =>
          <>
            <div
              className={"Collection-Card " + getColorClassname(card.userCardPossessions?.[0], false, card.canBeReverse)}
              key={card.localId + index}
              data-id={card.name + card.cardSet.code + card.cardSet.cardSerie.code}>
              <div className="Collection-Card-imgContainer">
                <img
                  src={"src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"}
                />
                <div className="Collection-Card-img Collection-Card-img-reverseFilter"/>
                <div className="Collection-Card-img Collection-Card-img-classicFilter"/>
              </div>
              {collectionMode &&
              <div key={"overlay" + card.localId + index} className="Collection-Card-overlayContainer">
                <div className="Collection-Card-overlay"/>
              </div>}
              {collectionMode &&
              <div key={"content" + card.localId + index} className="Collection-Card-overlayBottom">
                <div className="Collection-Card-overlayBottom-content">
                  <div className="Collection-Card-overlayBottom-contentElement">
                    <div className="Collection-Card-overlayBottom-content-name">Carte normale</div>
                    <div className="Collection-Card-overlayBottom-content-management">
                      <button className="Collection-Card-overlayBottom-content-minus"
                              onClick={(event) => modifyQuantity(card, 'classic', 'minus', event.currentTarget)}>-
                      </button>
                      <input className="Collection-Card-overlayBottom-content-input"
                             onBlur={(event) => setQuantity(card, 'classic', event.currentTarget)}
                             value={card?.userCardPossessions?.[0]?.classicQuantity ?? 0} type="number"/>
                      <button className="Collection-Card-overlayBottom-content-plus"
                              onClick={(event) => modifyQuantity(card, 'classic', 'plus', event.currentTarget)}>+
                      </button>
                    </div>
                  </div>
                  {(!separateReverse && card.canBeReverse) &&
                  <div className="Collection-Card-overlayBottom-contentElement">
                    <div className="Collection-Card-overlayBottom-content-name">Carte reverse</div>
                    <div className="Collection-Card-overlayBottom-content-management">
                      <button className="Collection-Card-overlayBottom-content-minus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'minus', event.currentTarget)}>-
                      </button>
                      <input className="Collection-Card-overlayBottom-content-input" min="0"
                             onBlur={(event) => setQuantity(card, 'reverse', event.currentTarget)}
                             value={card?.userCardPossessions?.[0]?.reverseQuantity ?? 0} type="number"/>
                      <button className="Collection-Card-overlayBottom-content-plus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'plus', event.currentTarget)}>+
                      </button>
                    </div>
                  </div>}
                </div>
              </div>}
            </div>
            {collectionMode && separateReverse && card.canBeReverse &&
            <div className={"Collection-Card " + getColorClassname(card.userCardPossessions[0], true)}
                 key={"reverseOnly" + card.localId + index}
                 data-id={card.name + card.cardSet.code + card.cardSet.cardSerie.code}>
              <div className="Collection-Card-imgContainer">
                <img
                  src={"src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"}
                />
                <div className="Collection-Card-img Collection-Card-img-reverseFilter"/>
                <div className="Collection-Card-img Collection-Card-img-classicFilter"/>
              </div>
              <div className="Collection-Card-overlayContainer">
                <div className="Collection-Card-overlay"/>
              </div>
              <div className="Collection-Card-overlayBottom">
                <div className="Collection-Card-overlayBottom-content">
                  <div className="Collection-Card-overlayBottom-contentElement">
                    <div className="Collection-Card-overlayBottom-content-name">Carte reverse</div>
                    <div className="Collection-Card-overlayBottom-content-management">
                      <button className="Collection-Card-overlayBottom-content-minus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'minus', event.currentTarget)}>-
                      </button>
                      <input className="Collection-Card-overlayBottom-content-input" min="0"
                             onBlur={(event) => setQuantity(card, 'reverse', event.currentTarget)} readOnly
                             value={card?.userCardPossessions?.[0]?.reverseQuantity ?? 0} type="number"/>
                      <button className="Collection-Card-overlayBottom-content-plus"
                              onClick={(event) => modifyQuantity(card, 'reverse', 'plus', event.currentTarget)}>+
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          </>,
        )}
      </div>
    </div>
  )

}
