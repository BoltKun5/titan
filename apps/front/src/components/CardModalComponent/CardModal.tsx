import React, { useContext, useEffect, useState } from 'react';
import './style.scss';
import { Modal, Tooltip, Zoom, capitalize } from '@mui/material';
import {
  getImageSource,
  isUnloggedPage,
  isUserConnected,
} from '../../general.utils';
import StoreContext from '../../hook/contexts/StoreContext';
import { Add, Close } from '@mui/icons-material';
import { CardPossessionComponent } from '../CardPossessionComponent/CardPossessionComponent';
import CardModalContext from '../../hook/contexts/CardModalContext';
import { ButtonComponent } from '../UI/Button/ButtonComponent';
import { AxiosResponse } from 'axios';
import { loggedApi } from '../../axios';
import {
  ICard,
  IUserCardPossession,
  IResponse,
  ICreatePossessionResponse,
  IUpdatePossessionResponse,
  CardRarityEnum,
  CardRarityEnumFrench,
  CardTypeEnumFrench,
} from 'vokit_core';
import Backdrop from '@mui/material/Backdrop';
import { useParams } from 'react-router-dom';

export const CardModal: React.FC<{
  card: ICard | null;
  closeModal: () => void;
}> = ({ card, closeModal }) => {
  const { series, cards, setCards } = useContext(StoreContext);
  const [localCardPossession, setLocalCardPossession] = useState<
    IUserCardPossession[]
  >([]);
  const [handlingClose, setHandlingClose] = useState(false);
  const [open, setOpen] = useState(false);

  const connectedUser = isUserConnected();

  let id: string | undefined = useParams().id;
  if (!isUnloggedPage()) {
    id = undefined;
  }

  useEffect(() => {
    setLocalCardPossession([...(card?.userCardPossessions ?? [])]);
  }, [card]);

  const context = {
    localCardPossession,
    setLocalCardPossession,
  };

  const createPossession = async () => {
    try {
      const response: AxiosResponse<
        IResponse<ICreatePossessionResponse>,
        any
      > = await loggedApi.post(`/possession/create`, {
        cardId: card?.id,
      });
      setCards(
        cards.map((localCard) => {
          if (card?.id === localCard.id) {
            localCard.userCardPossessions.push(
              response.data.data?.possession as IUserCardPossession,
            );
          }
          return localCard;
        }),
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
          if (!id) {
            return true;
          } else {
            return id === el.id;
          }
        })
        .map((el) => {
          const currentPossession = card?.userCardPossessions.find(
            (poss) => poss.id === el.id,
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
                cardPossessionId: currentPossession?.id ?? '',
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
      > = await loggedApi.post(`/possession/update`, {
        cardId: card?.id,
        possessions: possessions.map((possession) => {
          const _possession: any = {};
          _possession.boosterId = possession.boosterId;
          _possession.condition = possession.condition;
          _possession.deletionType = possession.deletionType;
          _possession.language = possession.language;
          _possession.grade = possession.grade;
          _possession.note = possession.note;
          _possession.printingId = possession.printingId;
          _possession.id = possession.id;

          return _possession;
        }),
        ...(createList.length > 0 ? { createdTags: createList } : {}),
        ...(deleteList.length > 0 ? { deletedTags: deleteList } : {}),
      });

      if (!id) {
        setCards(
          cards.map((localCard) => {
            if (card?.id === localCard.id) {
              localCard.userCardPossessions = response.data.data
                ?.possessions as IUserCardPossession[];
            }
            return localCard;
          }),
        );
        setLocalCardPossession(response.data.data?.possessions ?? []);
      } else {
        setCards(
          cards.map((localCard) => {
            if (card?.id === localCard.id) {
              localCard.userCardPossessions = response.data.data
                ?.possessions as IUserCardPossession[];
            }
            return localCard;
          }),
        );
        setLocalCardPossession(
          localCardPossession.map((el) => {
            if (el.id === id) {
              return response.data.data?.possessions.find(
                (subEl) => subEl.id === id,
              ) as IUserCardPossession;
            }
            return el;
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deletePossession = async (id: string) => {
    try {
      await loggedApi.post(`/possession/force-delete`, {
        possessionId: id,
      });
      const cleanCardPossession = [...localCardPossession];
      let index = localCardPossession.findIndex((el) => el.id === id);
      if (index !== -1) {
        cleanCardPossession.splice(index, 1);
        setLocalCardPossession(cleanCardPossession);
      }
      index = card?.userCardPossessions.findIndex((el) => el.id === id) ?? 0;
      if (index !== -1) {
        setCards(
          cards.map((localCard) => {
            if (card?.id === localCard.id) {
              localCard.userCardPossessions.splice(index, 1);
            }
            return localCard;
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setOpen(card ? true : false);
  }, [card]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    setTimeout(() => {
      if (!open && card) {
        closeModal();
      }
    }, 500);
  }, [open]);

  const handleCloseModal = () => {
    const unsavedData =
      JSON.stringify(localCardPossession) !==
      JSON.stringify(card?.userCardPossessions ?? []);
    if (!unsavedData) {
      return handleClose();
    } else {
      if (handlingClose) {
        setHandlingClose(false);
        return handleClose();
      } else {
        setHandlingClose(true);
      }
    }
  };

  return (
    <CardModalContext.Provider value={context}>
      {card && (
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            } as any,
          }}
        >
          <Zoom in={open} style={{ translate: 'calc(-50% - 1px) calc(-51%)' }}>
            <div className="CardModal coloredCorner">
              <div className="CardModal-paddingContainer">
                <div className="CardModal-closeButtonContainer">
                  <div
                    className="CardModal-closeButton"
                    onClick={handleCloseModal}
                  >
                    <Close />
                  </div>
                </div>
                <div className="CardModal-cardInfos">
                  <div className="CardModal-cardMain">
                    <div className="CardModal-name">{card?.name}</div>
                    <img
                      src={card ? getImageSource(card, true) : ''}
                      onLoad={(e) => {
                        e.currentTarget.classList.add('show');
                      }}
                    />
                  </div>
                  <div className="CardModal-cardMisc">
                    <div
                      className="CardModal-stylizedContainer"
                      style={{ animationDelay: '0.4s' }}
                    >
                      <div className="CardModal-stylizedMain">
                        <div>Numéro</div>
                      </div>
                      <div className="CardModal-stylizedImage">
                        {card?.localId.padStart(3, '0')}
                      </div>
                    </div>
                    <div
                      className="CardModal-stylizedContainer"
                      style={{ animationDelay: '.6s' }}
                    >
                      <div className="CardModal-stylizedMain">
                        <div>Rareté</div>
                      </div>
                      <div className="CardModal-stylizedImage">
                        <Tooltip
                          title={capitalize(
                            CardRarityEnumFrench[
                              card?.rarity ?? 0
                            ].toLowerCase(),
                          )}
                        >
                          <img
                            src={
                              '/assets/icons/' +
                              CardRarityEnum[card?.rarity ?? 0] +
                              '.png'
                            }
                            onLoad={(e) =>
                              e.currentTarget.classList.add('show')
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      className="CardModal-stylizedContainer"
                      style={{ animationDelay: '.8s' }}
                    >
                      <div className="CardModal-stylizedMain">
                        <div>Types</div>
                      </div>
                      <div className="CardModal-stylizedImage">
                        {card?.types.map((type) => (
                          <Tooltip
                            title={CardTypeEnumFrench[type.type]}
                            key={card.id + 'type' + type.id}
                          >
                            <img
                              src={`/assets/icons/types_icons/${
                                type?.type ?? 0
                              }.svg`}
                              onLoad={(e) =>
                                e.currentTarget.classList.add('show')
                              }
                            />
                          </Tooltip>
                        ))}
                        {card?.types.length === 0 && (
                          <Tooltip title={'Aucun type'}>
                            <img
                              src={`/assets/icons/types_icons/0.svg`}
                              onLoad={(e) =>
                                e.currentTarget.classList.add('show')
                              }
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div
                      className="CardModal-stylizedContainer"
                      style={{ animationDelay: '1s' }}
                    >
                      <div className="CardModal-stylizedMain">
                        <div>Série</div>
                      </div>
                      <div className="CardModal-stylizedImage">
                        {
                          series?.find(
                            (serie) => serie.id === card?.cardSet.cardSerieId,
                          )?.name
                        }
                      </div>
                    </div>
                    <div
                      className="CardModal-stylizedContainer"
                      style={{ animationDelay: '1.2s' }}
                    >
                      <div className="CardModal-stylizedMain">
                        <div>Extension</div>
                      </div>
                      <div className="CardModal-stylizedImage">
                        <Tooltip title={card?.cardSet.name}>
                          <img
                            src={`${
                              import.meta.env.VITE_ASSETS_URL
                            }/application-file/file/download/public-access/${
                              card?.cardSet.logoId
                            }`}
                            onLoad={(e) => {
                              e.currentTarget.classList.add('show');
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                {card?.userCardPossessions && (
                  <div className="CardModal-possessionsContainer">
                    <div className="CardModal-possessions">
                      <div className="CardModal-possessionHeaders">
                        <div className="CardModal-possessionTitle">
                          Exemplaires possédés
                        </div>
                        <div
                          onClick={() => savePossession()}
                          className="CardModal-saveAll"
                        >
                          {connectedUser && id === undefined && (
                            <ButtonComponent
                              label={'Tout enregistrer'}
                              disabled={
                                JSON.stringify(localCardPossession) ===
                                JSON.stringify(card.userCardPossessions)
                              }
                              height={25}
                              size={140}
                              fontSize={15}
                              clipPath={5}
                            />
                          )}
                        </div>
                      </div>
                      <div className="CardModal-possessionList">
                        <div className="CardModal-tableContainer">
                          {connectedUser && id === undefined && (
                            <div
                              className="CardModal-createPossessionButton"
                              onClick={() => createPossession()}
                            >
                              <span>
                                Ajouter un exemplaire à la collection <Add />
                              </span>
                            </div>
                          )}
                          {localCardPossession.map((possession, index) => {
                            return (
                              <CardPossessionComponent
                                index={index}
                                key={'Possession' + index}
                                card={card}
                                possession={possession}
                                update={(
                                  possessionIteration: IUserCardPossession,
                                ) => {
                                  const locPos = [...localCardPossession];
                                  locPos[index] = possessionIteration;
                                  setLocalCardPossession(locPos);
                                }}
                                delete={(id: string) => deletePossession(id)}
                                canSave={
                                  JSON.stringify(possession) !==
                                  JSON.stringify(
                                    card.userCardPossessions[index],
                                  )
                                }
                                save={() => savePossession(possession.id)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Modal
                open={handlingClose}
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    translate: 'yes',
                  },
                }}
              >
                <Zoom
                  in={handlingClose}
                  style={{ translate: 'calc(-50% - 1px) calc(-51%)' }}
                >
                  <div className="CardModal-confirmClose">
                    <span>
                      Les modifications non enregistrées seront perdues.
                    </span>
                    <div className="CardModal-buttonsContainer">
                      <div onClick={() => setHandlingClose(false)}>
                        <ButtonComponent
                          size={70}
                          label={'Rester'}
                          clipPath={10}
                          color="green"
                          fontSize={16}
                          height={40}
                        />
                      </div>
                      <div onClick={handleCloseModal}>
                        <ButtonComponent
                          size={70}
                          label={'Fermer'}
                          clipPath={10}
                          color="red"
                          fontSize={16}
                          height={40}
                        />
                      </div>
                    </div>
                  </div>
                </Zoom>
              </Modal>
            </div>
          </Zoom>
        </Modal>
      )}
    </CardModalContext.Provider>
  );
};
