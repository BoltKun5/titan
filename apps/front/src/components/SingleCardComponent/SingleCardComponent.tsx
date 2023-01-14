import React, {
  createRef,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { SingleCardOverlayComponent } from "../SingleCardOverlayComponent/SingleCardOverlayComponent";
import "./style.scss";
import { CardModal } from "../CardModalComponent/CardModal";
import { getImageSource } from "../../pages/CardManager/CardManagerUtils";
import StoreContext from "../../hook/contexts/StoreContext";
import { ICard } from "vokit_core";
import { SingleCardComponentPropsType } from "../../local-core";

export const SingleCardComponent: React.FC<SingleCardComponentPropsType> = ({
  card,
  index,
  firstType,
}) => {
  const { collectionMode, separateReverse } = useContext(StoreContext);
  const [cardModal, setCardModal] = useState<ICard | null>(null);
  const [isMissingImage, setIsMissingImage] = useState<boolean>(false);

  const openCardInfo = (card: ICard) => {
    setCardModal(card);
  };

  const handleMissingImage = (
    error: SyntheticEvent<HTMLImageElement, Event>
  ) => {
    error.currentTarget.src = "src/assets/default_card_img.png";
    setIsMissingImage(true);
  };

  const elementRef = createRef<HTMLDivElement>();

  const [show, setShow] = useState(false);

  const [parent, setParent] = useState<HTMLElement | null | undefined>(null);

  const isElementInViewport = useCallback(() => {
    let windowHeight = parent?.clientHeight;
    let rect = elementRef.current?.getBoundingClientRect();
    if (show) return true;
    if (!rect || !windowHeight) return false;

    const requiredNullTop = rect?.top - 126 + rect.height;
    const requiredNullBottom = rect?.bottom - 126 - windowHeight - rect.height;

    return requiredNullTop > 0 && requiredNullBottom < 0;
  }, [parent, elementRef]);

  const scrollEventHandler = () => {
    setShow(isElementInViewport());
  };

  useEffect(() => {
    setParent(elementRef.current?.parentElement?.parentElement);
    setShow(isElementInViewport);
    if (!show) parent?.addEventListener("scroll", scrollEventHandler);
    return () => {
      parent?.removeEventListener("scroll", scrollEventHandler);
    };
  });

  return (
    <>
      {cardModal !== null && (
        <CardModal card={cardModal} closeModal={() => setCardModal(null)} />
      )}

      <div
        className={"SingleCard"}
        key={card.id}
        style={{
          ...(separateReverse && collectionMode ? { height: 420 } : {}),
        }}
        ref={elementRef}
      >
        {show && (
          <>
            <div
              className="SingleCard-imgContainer"
              onClick={() => openCardInfo(card)}
            >
              <div
                className="SingleCard-data"
                style={{ zIndex: isMissingImage ? 100 : 0 }}
              >
                {card.name} ({card.localId})<br />
                {card.cardSet.code} - {card.cardSet.name}
              </div>
              <img
                className="SingleCard-img"
                src={getImageSource(card)}
                loading={"lazy"}
                onError={handleMissingImage}
              />
            </div>

            <div className="SingleCard-collectionBackground" />
            <SingleCardOverlayComponent
              firstType={firstType}
              card={card}
              index={index}
            />
          </>
        )}
      </div>
    </>
  );
};
