import React, { SyntheticEvent, useContext, useState } from "react";
import CardManagerContext from "../../hook/contexts/CardManagerContext";
import { SingleCardOverlayComponent } from "../SingleCardOverlayComponent/SingleCardOverlayComponent";
import './SingleCardComponent.scss'
import { CardModal } from "../CardModalComponent/CardModal";
import { getImageSource } from "../../pages/CardManager/CardManagerUtils";
import { ICard, IUserCardPossession, SingleCardComponentPropsType } from "../../../../local-core";

export const SingleCardComponent: React.FC<SingleCardComponentPropsType> = ({ card, index, firstType }) => {
  const { collectionMode, separateReverse } = useContext(CardManagerContext);
  const [cardModal, setCardModal] = useState<ICard | null>(null);
  const [isMissingImage, setIsMissingImage] = useState<boolean>(false);

  const getColorClassname = (userCardPossession: IUserCardPossession, reverseOnly: boolean = false, canBeReverse: boolean = true) => {
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

  const openCardInfo = (card: ICard) => {
    setCardModal(card);
  }

  const handleMissingImage = (error: SyntheticEvent<HTMLImageElement, Event>) => {
    error.currentTarget.src = "src/assets/default_card_img.png"
    setIsMissingImage(true)
  }

  return (
    <>
      {
        cardModal !== null && <CardModal card={cardModal} closeModal={() => setCardModal(null)} />
      }

      <div
        className={"SingleCard " + (collectionMode ? getColorClassname(card.userCardPossessions?.[0], firstType === 'reverse', card.canBeReverse) : '')}
        key={card.id}>

        <div className="SingleCard-imgContainer" onClick={() => openCardInfo(card)}>
          <div className="SingleCard-data" style={{ zIndex: isMissingImage ? 100 : 0 }}>
            {card.name} ({card.localId})<br />
            {card.cardSet.code} - {card.cardSet.name}
          </div>
          {
            collectionMode && card.canBeReverse ?
              <>
                <img className="SingleCard-possession-reverse" loading={"lazy"}
                  src={getImageSource(card)} onError={handleMissingImage} />
                <img className="SingleCard-possession-classic" loading={"lazy"}
                  src={getImageSource(card)} onError={handleMissingImage} />
              </> : <img className="SingleCard-img" src={getImageSource(card)} loading={"lazy"}
                onError={handleMissingImage} />
          }
        </div>

        {collectionMode && <SingleCardOverlayComponent firstType={firstType} card={card} index={index} />}
      </div>
    </>
  )
}
