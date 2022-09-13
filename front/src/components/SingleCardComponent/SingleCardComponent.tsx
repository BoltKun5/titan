import React, {useContext, useState} from "react";
import {SingleCardComponentPropsType} from "../../../typing/types";
import {UserCardPossession} from "../../../../api/src/database/models/UserCardPossession";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import {SingleCardOverlayComponent} from "../SingleCardOverlayComponent/SingleCardOverlayComponent";
import {Card} from "../../../../api/src/database"
import './SingleCardComponent.scss'
import {CardModal} from "../CardModalComponent/CardModal";
import {getImageSource} from "../../pages/CardManager/CardManagerUtils";

export const SingleCardComponent: React.FC<SingleCardComponentPropsType> = ({card, index, firstType}) => {
  const {collectionMode, separateReverse} = useContext(CardManagerContext);
  const [cardModal, setCardModal] = useState<Card | null>(null);

  const getColorClassname = (userCardPossession: UserCardPossession, reverseOnly: boolean = false, canBeReverse: boolean = true) => {
    if (!collectionMode) return;
    if (userCardPossession === undefined) return 'CardQuantity-notOwned';
    if (reverseOnly) return (userCardPossession?.reverseQuantity < 1 ? 'CardQuantity-notOwned' : 'CardQuantity-owned');
    if (!canBeReverse || (separateReverse && !reverseOnly)) return (userCardPossession?.classicQuantity < 1 ? 'CardQuantity-notOwned' : 'CardQuantity-owned');

    if (userCardPossession?.reverseQuantity < 1 && userCardPossession?.classicQuantity < 1) {
      return 'CardQuantity-notOwned';
    }
    if (userCardPossession?.reverseQuantity > 0 && userCardPossession?.classicQuantity > 0) {
      return 'CardQuantity-owned';
    }
    if (userCardPossession?.reverseQuantity > 0 && userCardPossession?.classicQuantity < 1) {
      return 'CardQuantity-onlyReverse'
    }
    if (userCardPossession?.classicQuantity > 0 && userCardPossession?.reverseQuantity < 1) {
      return 'CardQuantity-onlyClassic'
    }
    return ""
  }

  const openCardInfo = (card: Card) => {
    setCardModal(card);
  }

  return (
    <>
      {
        cardModal !== null && <CardModal card={cardModal} closeModal={() => setCardModal(null)}/>
      }

      <div
        className={"SingleCard " + (collectionMode ? getColorClassname(card.userCardPossessions?.[0], firstType === 'reverse', card.canBeReverse) : '')}
        key={card.id}>

        <div className="SingleCard-imgContainer" onClick={() => openCardInfo(card)}>
          <div className="SingleCard-data">
            {card.name} ({card.localId})<br/>
            {card.cardSet.code} - {card.cardSet.name}
          </div>
          {
            collectionMode && card.canBeReverse ?
              <>
                <img className="SingleCard-possession-reverse" loading={"lazy"}
                     src={getImageSource(card)}/>
                <img className="SingleCard-possession-classic" loading={"lazy"}
                     src={getImageSource(card)}
                     onError={(el) => el.currentTarget.setAttribute("src", "")}/>
              </> : <img className="SingleCard-img" src={getImageSource(card)} loading={"lazy"}
                         onError={el => el.currentTarget.style.display = "none"}/>
          }
        </div>

        {collectionMode && <SingleCardOverlayComponent firstType={firstType} card={card} index={index}/>}
      </div>
    </>
  )
}
