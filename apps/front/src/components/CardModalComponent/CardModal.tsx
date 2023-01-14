import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { ClickAwayListener, Tooltip } from "@mui/material";
import {
  frontRarity,
  getImageSource,
} from "../../pages/CardManager/CardManagerUtils";
import StoreContext from "../../hook/contexts/StoreContext";
import { Add, Close } from "@mui/icons-material";
import { CardPossessionComponent } from "../CardPossessionComponent/CardPossessionComponent";
import CardModalContext from "../../hook/contexts/CardModalContext";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import { AxiosResponse } from "axios";
import { loggedApi } from "../../axios";
import {
  ICard,
  IUserCardPossession,
  IResponse,
  ICreatePossessionResponse,
  IUpdatePossessionResponse,
  CardRarityEnum,
} from "vokit_core";

export const CardModal: React.FC<{ card: ICard; closeModal: () => void }> = ({
  card,
  closeModal,
}) => {
  const { series, cards, setCards } = useContext(StoreContext);
  const [localCardPossession, setLocalCardPossession] = useState<
    IUserCardPossession[]
  >([]);
  const [handleClose, setHandleClose] = useState(false);

  useEffect(() => {
    setLocalCardPossession([...card.userCardPossessions]);
  }, []);

  const context = {
    localCardPossession,
    setLocalCardPossession,
  };

  const createPossession = async () => {
    try {
      const response: AxiosResponse<
        IResponse<ICreatePossessionResponse>,
        any
      > = await loggedApi.post(`/usercards/createPossession`, {
        cardId: card.id,
      });
      setCards(
        cards.map((localCard) => {
          if (card.id === localCard.id) {
            localCard.userCardPossessions.push(
              response.data.data?.possession as IUserCardPossession
            );
          }
          return localCard;
        })
      );
      setLocalCardPossession([
        ...localCardPossession,
        response.data.data?.possession as IUserCardPossession,
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const savePossession = async (id: string | null = null) => {
    try {
      const deleteList: { cardPossessionId: string; tagId: string }[] = [];
      const createList: { cardPossessionId: string; tagId: string }[] = [];

      const possessions = localCardPossession
        .filter((el) => {
          if (!id) return true;
          else return id === el.id;
        })
        .map((el) => {
          const currentPossession = card.userCardPossessions.find(
            (poss) => poss.id === el.id
          );

          for (const tag of el.tags ?? []) {
            if (
              currentPossession?.tags?.findIndex((e) => e.id === tag.id) === -1
            ) {
              createList.push({
                cardPossessionId: currentPossession.id,
                tagId: tag.id,
              });
            }
          }
          for (const tag of currentPossession?.tags ?? []) {
            if (el?.tags?.findIndex((e) => e.id === tag.id) === -1) {
              deleteList.push({
                cardPossessionId: currentPossession?.id ?? "",
                tagId: tag.id,
              });
            }
          }
          delete el.tags;
          return el;
        });

      const response: AxiosResponse<
        IResponse<IUpdatePossessionResponse>,
        any
      > = await loggedApi.post(`/usercards/update`, {
        cardId: card.id,
        possessions,
        ...(createList.length > 0 ? { createdTags: createList } : {}),
        ...(deleteList.length > 0 ? { deletedTags: deleteList } : {}),
      });

      if (!id) {
        setCards(
          cards.map((localCard) => {
            if (card.id === localCard.id) {
              localCard.userCardPossessions = response.data.data
                ?.possessions as IUserCardPossession[];
            }
            return localCard;
          })
        );
        setLocalCardPossession(response.data.data?.possessions ?? []);
      } else {
        setCards(
          cards.map((localCard) => {
            if (card.id === localCard.id) {
              localCard.userCardPossessions = response.data.data
                ?.possessions as IUserCardPossession[];
            }
            return localCard;
          })
        );
        setLocalCardPossession(
          localCardPossession.map((el) => {
            if (el.id === id) {
              return response.data.data?.possessions.find(
                (subEl) => subEl.id === id
              ) as IUserCardPossession;
            }
            return el;
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deletePossession = async (id: string) => {
    try {
      await loggedApi.post(`/usercards/forceDeletePossession`, {
        possessionId: id,
      });
      const cleanCardPossession = [...localCardPossession];
      let index = localCardPossession.findIndex((el) => el.id === id);
      if (index !== -1) {
        cleanCardPossession.splice(index, 1);
        setLocalCardPossession(cleanCardPossession);
      }
      index = card.userCardPossessions.findIndex((el) => el.id === id);
      if (index !== -1) {
        setCards(
          cards.map((localCard) => {
            if (card.id === localCard.id) {
              localCard.userCardPossessions.splice(index, 1);
            }
            return localCard;
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCloseModal = () => {
    const unsavedData =
      JSON.stringify(localCardPossession) !==
      JSON.stringify(card.userCardPossessions);
    if (!unsavedData) return closeModal();
    else {
      if (handleClose) {
        return closeModal();
      } else {
        setHandleClose(true);
      }
    }
  };

  return (
    <CardModalContext.Provider value={context}>
      <div className="CardModal">
        <div className="CardModal-modale">
          <div className="CardModal-miscContainer">
            <div className="CardModal-misc">
              <div className="CardModal-name">{card.name}</div>
              <div className="CardModal-subMisc">
                <div className="CardModal-serieContainer">
                  <div className="CardModal-serie">
                    {
                      series?.find(
                        (serie) => serie.id === card.cardSet.cardSerieId
                      )?.name
                    }
                  </div>
                  <div className="CardModal-set">
                    <Tooltip title={card.cardSet.name}>
                      <img
                        src={
                          "./src/assets/setIcons/" + card.cardSet.code + ".png"
                        }
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="CardModal-rarityContainer">
                  <img
                    className="CardModal-rarityImg"
                    src={
                      "./src/assets/icons/" +
                      CardRarityEnum[card.rarity] +
                      ".png"
                    }
                  />
                  <span>
                    {frontRarity[
                      CardRarityEnum[card.rarity]
                    ].toLocaleUpperCase()}
                  </span>
                </div>
              </div>
              <img src={getImageSource(card, true)} />
            </div>
          </div>
          <div className="CardModal-possessionsContainer">
            <div className="CardModal-possessions">
              <div className="CardModal-possessionHeaders">
                <div className="CardModal-possessionTitle">
                  Exemplaires possédés
                </div>
                <div onClick={() => savePossession()}>
                  <ButtonComponent
                    label={"Enregistrer"}
                    disabled={
                      JSON.stringify(localCardPossession) ===
                      JSON.stringify(card.userCardPossessions)
                    }
                    height={40}
                    size={180}
                  />
                </div>
              </div>
              <div className="CardModal-possessionList">
                <div className="CardModal-tableContainer">
                  <div
                    className="CardModal-createPossessionButton"
                    onClick={() => createPossession()}
                  >
                    <span>
                      Ajouter un exemplaire à la collection <Add />
                    </span>
                  </div>
                  {localCardPossession.map((possession, index) => {
                    return (
                      <CardPossessionComponent
                        index={index}
                        key={"Possession" + index}
                        card={card}
                        possession={possession}
                        update={(possessionIteration: IUserCardPossession) => {
                          const locPos = [...localCardPossession];
                          locPos[index] = possessionIteration;
                          setLocalCardPossession(locPos);
                        }}
                        delete={(id: string) => deletePossession(id)}
                        canSave={
                          JSON.stringify(possession) !==
                          JSON.stringify(card.userCardPossessions[index])
                        }
                        save={() => savePossession(possession.id)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="CardModal-closeButtonContainer">
            {handleClose ? (
              <ClickAwayListener
                onClickAway={() => {
                  if (handleClose) setHandleClose(false);
                }}
              >
                <div className="CardModal-confirmClose">
                  <span>
                    Les modifications non enregistrées seront perdues.
                  </span>
                  <div onClick={handleCloseModal}>
                    <ButtonComponent
                      size={90}
                      label={"Quitter"}
                      color={"green"}
                      height={40}
                    />
                  </div>
                </div>
              </ClickAwayListener>
            ) : (
              <div className="CardModal-closeButton" onClick={handleCloseModal}>
                <Close />
              </div>
            )}
          </div>
        </div>
      </div>
    </CardModalContext.Provider>
  );
};
