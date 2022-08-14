import React, {useContext} from "react";
import {SingleCardComponentPropsType} from "../../../typing/types";
import {UserCardPossession} from "../../../../api/src/database/models/UserCardPossession";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import {SingleCardOverlayComponent} from "../SingleCardOverlayComponent/SingleCardOverlayComponent";
import {Card} from "../../../../api/src/database"
import './SingleCardComponent.scss'
import {canBeReverse} from "../CardManagerCardListComponent/CardManagerCardListComponent";

export const SingleCardComponent: React.FC<SingleCardComponentPropsType> = ({card, index, firstType}) => {
  const {collectionMode, separateReverse} = useContext(CardManagerContext);

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

  const getImageSource = (card: Card): string => {
    const isValid = !isNaN(Number(card.localId));
    if (isValid) return "src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"
    return "src/assets/cards/" + card.cardSet.code + "/" + card.localId + ".jpg"
  }
  return (
    <div
      className={"SingleCard " + getColorClassname(card.userCardPossessions?.[0], firstType === 'reverse', canBeReverse(card))}
      key={card.id}>

      <div className="SingleCard-imgContainer">
        <div className="SingleCard-data">
          {card.name} ({card.localId})<br/>
          {card.cardSet.code} - {card.cardSet.name}
        </div>
        {
          collectionMode && canBeReverse(card) ?
            <>
              <img className="SingleCard-possession-reverse" loading={"lazy"}
                   src={"src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"}/>
              <img className="SingleCard-possession-classic" loading={"lazy"}
                   src={"src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"}/>
            </> : <img className="SingleCard-img" src={getImageSource(card)} loading={"lazy"}/>
        }
      </div>

      {collectionMode && <SingleCardOverlayComponent firstType={firstType} card={card} index={index}/>}
    </div>
  )
}
