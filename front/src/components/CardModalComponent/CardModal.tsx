import React from "react";
import './CardModal.scss';
import { ClickAwayListener } from "@mui/material";
import { CardRarityEnum, ICard } from "./../../../../local-core";

export const CardModal: React.FC<{ card: ICard, closeModal: () => void }> = ({ card, closeModal }) => {
  return (
    <div className="CardModal">
      <ClickAwayListener onClickAway={() => closeModal()}>
        <div className="CardModal-modale">
          <div className="CardModal-image">
            <img src={"src/assets/cards/" + card.cardSet.code + "/" + Number(card.localId) + ".jpg"} />
          </div>
          <div className="CardModal-informations">
            <div className="CardModal-name">
              {card.name}
              <div className={"CardModal-logos"}>
                <img className="CardModal-rarityImg" src={"./src/assets/icons/" + CardRarityEnum[card.rarity] + ".png"} />
                <img className="CardModal-setLogo" src={"./src/assets/setIcons/" + card.cardSet.code + ".png"} />
              </div>
            </div>
            <div className="CardModal-setInfo">
              <div><b>Set : </b>{card.cardSet.name}</div>
              <div><b>Numéro de carte : </b>{card.localId}</div>
              <div><b>Id : </b>{card.id}</div>

            </div>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  )
}
