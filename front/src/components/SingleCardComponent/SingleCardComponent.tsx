import React, { createRef, SyntheticEvent, useCallback, useContext, useEffect, useRef, useState } from "react";

import { SingleCardOverlayComponent } from "../SingleCardOverlayComponent/SingleCardOverlayComponent";
import './style.scss'
import { CardModal } from "../CardModalComponent/CardModal";
import { getImageSource } from "../../pages/CardManager/CardManagerUtils";
import { ICard, IUserCardPossession, SingleCardComponentPropsType } from "../../../../local-core";
import StoreContext from "../../hook/contexts/StoreContext";

export const SingleCardComponent: React.FC<SingleCardComponentPropsType> = ({ card, index, firstType }) => {
  const { collectionMode, separateReverse } = useContext(StoreContext);
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

  const elementRef = createRef<HTMLDivElement>();

  const [show, setShow] = useState(false);

  const [parent, setParent] = useState<HTMLElement | null | undefined>(null);



  const isElementInViewport = useCallback(() => {
    let windowHeight = parent?.clientHeight
    let rect = elementRef.current?.getBoundingClientRect();
    if (show) return true;
    if (!rect || !windowHeight) return false;

    const requiredNullTop = (rect?.top - 126 + rect.height);
    const requiredNullBottom = (rect?.bottom - 126 - windowHeight - rect.height);

    return (requiredNullTop > 0 && requiredNullBottom < 0)
  }, [parent, elementRef])

  const scrollEventHandler = () => {
    setShow(isElementInViewport())
  }

  useEffect(() => {
    setParent(elementRef.current?.parentElement?.parentElement);
    setShow(isElementInViewport);
    if (!show)
      parent?.addEventListener("scroll", scrollEventHandler)
    return () => {
      parent?.removeEventListener("scroll", scrollEventHandler);
    }
  });

  return (
    <>
      {
        cardModal !== null && <CardModal card={cardModal} closeModal={() => setCardModal(null)} />
      }

      <div
        className={"SingleCard  " + (collectionMode ? getColorClassname(card.userCardPossessions?.[0], firstType === 'reverse', card.canBeReverse) : 'SingleCard-notCollection')}
        key={card.id} style={{ ...(separateReverse && collectionMode ? { height: 420 } : {}) }} ref={elementRef}>

        {
          show && <>
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


            {collectionMode && (
              <>
                <div className="SingleCard-collectionBackground" />
                <SingleCardOverlayComponent firstType={firstType} card={card} index={index} />
              </>
            )}
          </>
        }


      </div>
    </>
  )
}
