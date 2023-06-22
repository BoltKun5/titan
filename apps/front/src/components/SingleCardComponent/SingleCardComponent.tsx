import React, {
  createRef,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { SingleCardOverlayComponent } from "../SingleCardOverlayComponent/SingleCardOverlayComponent";
import "./style.scss";
import { CardModal } from "../CardModalComponent/CardModal";
import StoreContext from "../../hook/contexts/StoreContext";
import { ICard } from "vokit_core";
import { SingleCardComponentPropsType } from "../../local-core";
import { getImageSource } from "../../general.utils";

export const SingleCardComponent: React.FC<SingleCardComponentPropsType> = ({
  card,
  index,
  firstType,
}) => {
  const { collectionMode, separateReverse } = useContext(StoreContext);
  const [cardModal, setCardModal] = useState<ICard | null>(null);
  const [isMissingImage, setIsMissingImage] = useState<boolean>(false);
  const imageElement = useRef(null)

  const openCardInfo = (card: ICard) => {
    setCardModal(card);
  };

  const elementRef = createRef<HTMLDivElement>();

  const [show, setShow] = useState(false);

  const [parent, setParent] = useState<HTMLElement | null | undefined>(null);

  // useEffect(() => {
  //   if (show) {
  //     const url = getImageSource(card, true);
  //     (imageElement.current as unknown as HTMLImageElement).setAttribute('src', url)
  //   }
  // }, [show])

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
        {isElementInViewport() && (
          <>
            <div
              className="SingleCard-imgContainer"
              onClick={() => openCardInfo(card)}
            >
              <div className="SingleCard-infos">
                {card.name} ({card.localId})
              </div>
              <img
                ref={imageElement}
                className="SingleCard-img"
                src={getImageSource(card, true)}
                onLoad={(e) => {
                  e.currentTarget.classList.add('show')
                }}
                loading={"lazy"}
              />
            </div>

            <div className="SingleCard-collectionBackground" />
            {card.userCardPossessions && <SingleCardOverlayComponent
              firstType={firstType}
              card={card}
              index={index}
            />}
          </>
        )}
      </div>
    </>
  );
};
