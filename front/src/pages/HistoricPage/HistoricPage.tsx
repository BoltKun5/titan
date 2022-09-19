import dayjs from "dayjs";
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useFetchData } from "../../hook/api/cards";
import { getImageSource } from "../CardManager/CardManagerUtils";
import './HistoricPage.scss'

export const HistoricPage: React.FC = () => {
  const { isLoading, fetch } = useFetchData();
  const [historicList, setHistoricList] = useState<any[]>([]);
  const [boosterIdToShow, setBoosterIdToShow] = useState<string>('');


  const fetchHistoric = useCallback(async () => {

    const params: Record<string, any> = {
      userId: JSON.parse(localStorage.getItem("user") ?? '{}').id
    }

    const response = await fetch('/usercards/historic', params);
    setHistoricList(response.data.result)
  }, [])

  useEffect(() => {
    fetchHistoric();
  }, [])

  const showBoosterContent = (boosterId: string) => {
    setBoosterIdToShow(boosterId)
  }

  return (
    <div className="HistoricPage-container">
      <div className="HistoricPage-content">
        <h1>Historique des quantités</h1>
        <div className="HistoricPage-tableHeaders">
          <div className="HistoricPage-cardName">Nom de la carte</div>
          <div className="HistoricPage-normalQuantity">Quantité normale</div>
          <div className="HistoricPage-reverseQuantity">Quantité reverse</div>
          <div className="HistoricPage-booster">Booster</div>
          <div className="HistoricPage-date">Date</div>
        </div>
        <div className="HistoricPage-tableContent">
          {
            historicList.map((historyElement, index) => (
              <div className="HistoricPage-tableLine" key={"HistoryElementKey" + index}>
                <div className="HistoricPage-cardName">{historyElement.cardPossession.card.name}</div>
                <div className="HistoricPage-normalQuantity">{historyElement.oldClassicQuantity} -{">"} {historyElement.newClassicQuantity}</div>
                <div className="HistoricPage-reverseQuantity">{historyElement.oldReverseQuantity} -{">"} {historyElement.newReverseQuantity}</div>
                <div className="HistoricPage-booster">{historyElement.boosterId ? <a onClick={() => { showBoosterContent(historyElement.boosterId) }}>Voir le booster</a> : '-'}</div>
                <div className="HistoricPage-date">{dayjs(historyElement.createdAt).format('DD/MM/YYYY')}</div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="HistoricPage-boosterContent">
        {
          historicList.filter((element) => element.boosterId === boosterIdToShow).map((historyElement, index) => (
            <div key={"HistoryBoosterContentElement" + index}>
              <img src={getImageSource(historyElement.cardPossession.card)} />
            </div>
          ))
        }
      </div>
    </div >
  )
};
