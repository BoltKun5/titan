import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { loggedApi } from "../../axios";

import StoreContext from "../../hook/contexts/StoreContext";
import "./style.scss";
import {
  ICard,
  IResponse,
  ICreatePossessionResponse,
  CardAdditionalPrintingTypeEnum,
  IUserCardPossession,
  ISetQuantityResponse,
  ISimpleDeletePossessionResponse,
} from "vokit_core";
import { CardCounterComponentPropsType } from "../../local-core";

export const CardCounterComponent: React.FC<CardCounterComponentPropsType> = ({
  card,
  label,
  type,
  canBeReverse = true,
}) => {
  const { setCards, cards, notifications, setNotifications } =
    useContext(StoreContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [changeNotificationValue, setChangeNotificationValue] = useState<
    number | null
  >(null);
  const [notifTimer, setNotifTimer] = useState<number | undefined>(undefined);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setValue(getValue(card));
  }, [cards]);

  const createPossession = async (
    card: ICard,
    cardType: "classic" | "reverse"
  ) => {
    try {
      setIsDisabled(true);
      const response: AxiosResponse<
        IResponse<ICreatePossessionResponse>,
        any
      > = await loggedApi.post(`/usercards/createPossession`, {
        cardId: card.id,
        ...(cardType === "reverse"
          ? {
              cardPrintingId: card.cardAdditionalPrinting.find(
                (print) => print.type === CardAdditionalPrintingTypeEnum.REVERSE
              )?.id,
            }
          : {}),
      });
      setIsDisabled(false);
      setCards(
        cards.map((localCard) => {
          if (card.id === localCard.id) {
            localCard.userCardPossessions.push(
              response.data.data?.possession as unknown as IUserCardPossession
            );
          }
          return localCard;
        })
      );
      triggerChangeNotification(0, 1);
    } catch (e) {
      console.log(e);
    }
  };

  const deletePossession = async (
    card: ICard,
    cardType: "classic" | "reverse"
  ) => {
    if (getValue(card) === "0") return;
    try {
      setIsDisabled(true);
      const response: AxiosResponse<
        IResponse<ISimpleDeletePossessionResponse>,
        any
      > = await loggedApi.post(`/usercards/simpleDeletePossession`, {
        cardId: card.id,
        ...(cardType === "reverse"
          ? {
              cardPrintingId: card.cardAdditionalPrinting.find(
                (print) => print.type === CardAdditionalPrintingTypeEnum.REVERSE
              )?.id,
            }
          : {}),
      });
      setIsDisabled(false);
      if (response.data.data?.code === "NO_EMPTY_POSSESSION") {
        enqueueSnackbar("Impossible de supprimer suffisament d'éléments.");
        return;
      }
      setCards(
        cards.map((localCard) => {
          if (card.id === localCard.id) {
            for (const [
              index,
              possession,
            ] of localCard.userCardPossessions.entries()) {
              if (possession.id === response.data.data?.deletedId) {
                localCard.userCardPossessions.splice(index, 1);
                break;
              }
            }
          }
          return localCard;
        })
      );
      triggerChangeNotification(1, 0);
    } catch (e) {
      console.log(e);
    }
  };

  const startCountdown = () => {
    clearTimeout(notifTimer);
    setNotifTimer(
      setTimeout(() => {
        setChangeNotificationValue(null);
      }, 3000)
    );
  };

  const triggerChangeNotification = async (
    oldValue: number,
    newValue: number
  ) => {
    if (changeNotificationValue !== null) {
      setChangeNotificationValue(newValue - oldValue + changeNotificationValue);
    } else {
      setChangeNotificationValue(newValue - oldValue);
    }
    startCountdown();
  };

  const setQuantity = async (
    card: ICard,
    cardType: "classic" | "reverse",
    element: EventTarget & HTMLInputElement
  ) => {
    setIsDisabled(true);
    const regex = new RegExp("^[0-9]+$");
    if (!regex.test(element.value)) {
      element.style.color = "rgb(122, 28, 28)";
      setIsDisabled(false);
      return;
    }
    element.style.color = "rgb(201, 201, 201)";
    let oldValue;
    let possessions = card.userCardPossessions.filter((possession) =>
      cardType === "classic"
        ? possession.printing === null
        : possession.printing?.type === CardAdditionalPrintingTypeEnum.REVERSE
    );

    if (possessions.length === Number(element.value)) {
      setIsDisabled(false);
      return;
    }
    oldValue = possessions.length;

    try {
      const response: AxiosResponse<
        IResponse<ISetQuantityResponse>,
        any
      > = await loggedApi.post(`/usercards/setQuantity`, {
        cardId: card.id,
        cardPrintingId:
          cardType === "classic"
            ? null
            : card.cardAdditionalPrinting.find(
                (print) => print.type === CardAdditionalPrintingTypeEnum.REVERSE
              )?.id,
        quantity: element.value,
      });

      if (response.data.data?.code === "CARDS_CREATED") {
        triggerChangeNotification(0, response.data.data?.result?.length ?? 0);
        setCards(
          cards.map((localCard) => {
            if (card.id === localCard.id) {
              localCard.userCardPossessions =
                localCard.userCardPossessions.concat(
                  response.data.data?.result as unknown as IUserCardPossession
                );
            }
            return localCard;
          })
        );
        return;
      }

      if (
        response.data.data?.code === "CARDS_DELETED" ||
        response.data.data?.code === "NOT_ENOUGH_DELETABLE"
      ) {
        if (response.data.data?.code === "NOT_ENOUGH_DELETABLE")
          enqueueSnackbar("Impossible de supprimer suffisament d'éléments.");
        triggerChangeNotification(response.data.data?.result?.length ?? 0, 0);
        setCards(
          cards.map((localCard) => {
            if (card.id === localCard.id) {
              (response.data.data?.result as string[])?.forEach(
                (id: string) => {
                  const index = localCard.userCardPossessions
                    .map((e: IUserCardPossession) => e.id)
                    .indexOf(id);
                  localCard.userCardPossessions.splice(index, 1);
                }
              );
            }
            return localCard;
          })
        );
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsDisabled(false);
    }
  };

  const getValue = (card: ICard) => {
    return String(
      type === "classic"
        ? card?.userCardPossessions?.filter(
            (possession) => possession?.printing === null
          ).length
        : card?.userCardPossessions?.filter(
            (possession) =>
              possession.printing?.type ===
              CardAdditionalPrintingTypeEnum.REVERSE
          ).length
    );
  };

  const changeHandler = (element: EventTarget & HTMLInputElement) => {
    setValue(element.value);
  };

  return (canBeReverse && type === "reverse") || type !== "reverse" ? (
    <div className={"CardCounter"}>
      <div className="CardCounter-name">{label}</div>
      <div className="CardCounter-buttons">
        <button
          className="CardCounter-minus"
          disabled={isDisabled}
          onClick={() => deletePossession(card, type)}
        >
          -
        </button>
        <div className="CardCounter-inputContainer">
          <input
            className="CardCounter-input"
            disabled={isDisabled}
            onBlur={(ev) => setQuantity(card, type, ev.currentTarget)}
            onClick={(ev) => ev.currentTarget.select()}
            value={value}
            type="number"
            onChange={(ev) => changeHandler(ev.currentTarget)}
          />
        </div>
        <button
          className="CardCounter-plus"
          disabled={isDisabled}
          onClick={() => createPossession(card, type)}
        >
          +
        </button>
        {changeNotificationValue !== 0 && changeNotificationValue && (
          <div
            className={
              "CardCounter-diffNotif " +
              (changeNotificationValue > 0 ? "isPositive" : "isNegative")
            }
          >
            {changeNotificationValue > 0 ? "+" : ""}
            {changeNotificationValue}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="CardCounter-unusable">
      <div className="CardCounter-name">{label}</div>
      <div className="CardCounter-unusableMessage">N'existe pas en reverse</div>
    </div>
  );
};
