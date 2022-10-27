import React, { useContext } from "react";
import './style.scss';
import { ClickAwayListener } from "@mui/material";
import { CardRarityEnum, ICard } from "./../../../../local-core";
import { frontRarity, getImageSource } from "../../pages/CardManager/CardManagerUtils";
import CardManagerContext from "../../hook/contexts/CardManagerContext";

export const CardModal: React.FC<{ card: ICard, closeModal: () => void }> = ({ card, closeModal }) => {
  const { series } = useContext(CardManagerContext);
  return (
    <div className="CardModal">
      <ClickAwayListener onClickAway={() => closeModal()}>
        <div className="CardModal-modale coloredCorner">
          <div className="CardModal-image">
            <img src={getImageSource(card)} />
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
              <div><b>Série : </b>{series.find((serie) => serie.id === card.cardSet.cardSerieId)?.name}</div>
              <div><b>Set : </b>{card.cardSet.name}</div>
              <div><b>Numéro de carte : </b>{card.localId}</div>
              <div><b>Rareté : </b>{frontRarity[CardRarityEnum[card.rarity]]}</div>
              <div><b>Id : </b>{card.id}</div>

            </div>
          </div>
        </div>
      </ClickAwayListener>
    </div>
  )
}
