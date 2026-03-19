import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { SingleCardOverlayComponent } from '../SingleCardOverlayComponent/SingleCardOverlayComponent';
import './style.scss';
import StoreContext from '../../hook/contexts/StoreContext';
import {
  CardRarityEnum,
  CardRarityEnumFrench,
  CardTypeEnumFrench,
} from 'vokit_core';
import { SingleCardComponentPropsType } from '../../local-core';
import { getImageSource } from '../../general.utils';
import { Tooltip } from '@mui/material';

export const SingleCardComponent: React.FC<SingleCardComponentPropsType> = ({
  card,
  index,
  firstType,
  style,
  modal,
  setModal,
}) => {
  const { collectionMode, separateReverse } = useContext(StoreContext);
  const imageElement = useRef(null);
  const elementRef = createRef<HTMLDivElement>();
  const [show, setShow] = useState(false);
  const [parent, setParent] = useState<HTMLElement | null | undefined>(null);

  const isElementInViewport = useCallback(() => {
    const windowHeight = parent?.clientHeight;
    const rect = elementRef.current?.getBoundingClientRect();
    if (show) {
      return true;
    }
    if (!rect || !windowHeight) {
      return false;
    }

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
    if (!show) {
      parent?.addEventListener('scroll', scrollEventHandler);
    }
    return () => {
      parent?.removeEventListener('scroll', scrollEventHandler);
    };
  });

  return (
    <>
      <div
        className={'SingleCard' + (' ' + style)}
        key={card.id}
        style={{
          ...(separateReverse && collectionMode ? { height: 420 } : {}),
        }}
        ref={elementRef}
      >
        {style === 'line' && (
          <>
            <div className="SingleCard-setLogo">
              <Tooltip title={card.cardSet.name}>
                <img
                  src={`${
                    import.meta.env.VITE_ASSETS_URL
                  }/application-file/file/download/public-access/${
                    card.cardSet.logoId
                  }`}
                />
              </Tooltip>
            </div>
          </>
        )}
        <div className="SingleCard-imgContainer" onClick={() => setModal(card)}>
          <img
            ref={imageElement}
            className="SingleCard-img"
            src={getImageSource(card, true)}
            onLoad={(e) => {
              e.currentTarget.classList.add('show');
            }}
            loading={'lazy'}
          />
        </div>
        {style === 'line' && (
          <>
            <div className="SingleCard-hoverHandler" />
            <div className="SingleCard-lineInfo">
              <div className="SingleCard-lineInfo-type">
                <Tooltip title={CardTypeEnumFrench[card.types[0]?.type ?? 0]}>
                  <img
                    src={`/assets/icons/types_icons/${
                      card.types[0]?.type ?? 0
                    }.svg`}
                  />
                </Tooltip>
              </div>
              <div className="SingleCard-lineInfo-rarity">
                <Tooltip title={CardRarityEnumFrench[card.rarity]}>
                  <img
                    src={
                      '/assets/icons/' + CardRarityEnum[card.rarity] + '.png'
                    }
                  />
                </Tooltip>
              </div>
              <div className="SingleCard-lineInfo-name">
                <span>{card.localId}</span> {card.name}
              </div>
            </div>
          </>
        )}
        {style === 'line' && <div className="SingleCard-cardCounterAround" />}
        {card.userCardPossessions && (
          <SingleCardOverlayComponent
            firstType={firstType}
            card={card}
            index={index}
          />
        )}
        {style === 'line' && <div className="SingleCard-cardCounterAround" />}
      </div>
    </>
  );
};
