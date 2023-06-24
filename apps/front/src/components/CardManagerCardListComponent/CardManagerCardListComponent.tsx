import React, { useContext, useState } from "react";
import StoreContext from "../../hook/contexts/StoreContext";
import { SingleCardComponent } from "../SingleCardComponent/SingleCardComponent";
import "./style.scss";
import useWindowDimensions from "../../hook/utils/useWindowDimensions";
import { ICard } from "vokit_core";
import { Grow, Modal, Zoom } from "@mui/material";
import { CardModal } from "../CardModalComponent/CardModal";

export const CardManagerCardListComponent: React.FC = () => {
  const {
    cards,
    listDisplay
  } = useContext(StoreContext);

  const [cardModal, setCardModal] = useState<ICard | null>(null)

  return (
    <div className="CardManagerCardList">
      <CardModal card={cardModal} closeModal={() => setCardModal(null)} />
      {!listDisplay && <div className="CardManagerCardList-grid">
        {cards.map((card: any, index: number) => (
          <React.Fragment key={"firstCard" + card.localId + "0" + index}>
            <SingleCardComponent
              firstType={"classic"}
              card={card}
              index={index}
              modal={cardModal}
              setModal={setCardModal}
            />
          </React.Fragment>
        ))}
      </div>}

      {listDisplay && <div className="CardManagerCardList-list">
        {cards.map((card: any, index: number) => (
          <React.Fragment key={"firstCard" + card.localId + "0" + index + 'list'}>
            <SingleCardComponent
              firstType={"classic"}
              card={card}
              index={index}
              style={'line'}
              modal={cardModal}
              setModal={setCardModal}
            />
          </React.Fragment>
        ))}
      </div>}
    </div>
  );
};
