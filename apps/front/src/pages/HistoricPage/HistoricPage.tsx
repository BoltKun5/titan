import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getImageFromSeparatedInfos,
  getImageSource,
} from "../../general.utils";
import "./style.scss";
import EastIcon from "@mui/icons-material/East";
import { useFetchData } from "../../hook/api/cards";

export const HistoricPage: React.FC = () => {
  const { isLoading, fetch } = useFetchData();
  const [historicList, setHistoricList] = useState<any[]>([]);
  const [historicType, setHistoricType] = useState<null | "card" | "booster">(
    null
  );
  const [boosterHistoric, setBoosterHistoric] = useState([]);

  const fetchHistoric = useCallback(async () => {
    const params: Record<string, any> = {
      userId: JSON.parse(localStorage.getItem("user") ?? "{}").id,
    };

    const response = await fetch("/possession/historic", params);
    setHistoricList(response.data.result);

    const response2 = await fetch("/possession/boosters", params);
    setBoosterHistoric(response2.data);
  }, []);

  const manageScroll = (event: WheelEvent) => {
    if ((event.target as Element).matches(".HistoricPage-cardList")) {
      event.preventDefault();
      event.stopPropagation();
      const scrollContainer = event.target as Element;
      (scrollContainer as HTMLElement).scrollLeft += event.deltaY;
    }
    if ((event.target as Element).matches(".HistoricPage-boosterContent")) {
      event.preventDefault();
      event.stopPropagation();
      const scrollContainer = (event.target as Element).querySelector(
        ".HistoricPage-cardList"
      );
      (scrollContainer as HTMLElement).scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    fetchHistoric();
  }, []);

  useEffect(() => {
    document.addEventListener("wheel", manageScroll, { passive: false });
    return () => {
      document.removeEventListener("wheel", manageScroll);
    };
  });

  return (
    <div className="HistoricPage-container">
      <div className="HistoricPage-typeSelector coloredCorner">
        <div
          className="HistoricPage-type"
          onClick={() => setHistoricType("booster")}
        >
          <img src="/src/assets/booster.svg" />
          <span>BOOSTERS</span>
        </div>
        <div
          className="HistoricPage-type"
          onClick={() => setHistoricType("card")}
        >
          <img src={import.meta.env.VITE_ASSETS_URL + "/card.svg"} />
          <span>CARTES</span>
        </div>
      </div>
      {historicType === "card" && (
        <div className="HistoricPage-cardHistoric coloredCorner">
          <div className="HistoricPage-cardHistoricFilters"></div>
          <div className="HistoricPage-cardHistoricElements">
            <div className="HistoricPage-cardHistoricHead">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Set</th>
                    <th>Carte</th>
                    <th>Quantité normale</th>
                    <th>Quantité reverse</th>
                    <th>Date</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="HistoricPage-tableContainer">
              <table>
                <tbody>
                  {historicList.map((historyElement, index) => {
                    const normalDiff =
                      historyElement.newClassicQuantity -
                      historyElement.oldClassicQuantity;
                    const reverseDiff =
                      historyElement.newReverseQuantity -
                      historyElement.oldReverseQuantity;
                    return (
                      <tr key={"HistoryElementKey" + index}>
                        <td style={{ width: 40 }}>
                          <img
                            src={`src/assets/setIcons/${historyElement.cardPossession.card.cardSet.code}.png`}
                          />
                        </td>
                        <td>{historyElement.cardPossession.card.name}</td>
                        <td>
                          <div
                            className={
                              "HistoricPage-modif " +
                              (normalDiff > 0 ? "increase" : "decrease")
                            }
                          >
                            <span>{historyElement.oldClassicQuantity}</span>
                            {normalDiff !== 0 && (
                              <>
                                <EastIcon fontSize="large" />
                                <span>{historyElement.newClassicQuantity}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <div
                            className={
                              "HistoricPage-modif " +
                              (reverseDiff > 0 ? "increase" : "decrease")
                            }
                          >
                            <span>{historyElement.oldReverseQuantity}</span>
                            {reverseDiff !== 0 && (
                              <>
                                <EastIcon fontSize="large" />
                                <span>{historyElement.newReverseQuantity}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          {dayjs(historyElement.createdAt).format("DD/MM/YYYY")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {historicType === "booster" && (
        <div className="HistoricPage-boosterHistoric coloredCorner">
          <div className="HistoricPage-boosterHistoricGrid ">
            <div
              className="HistoricPage-cardListHover"
              onClick={() => {
                document
                  .querySelector(".HistoricPage-boosterHistoric")
                  ?.classList.remove("filter");
                document
                  .querySelector(`.HistoricPage-boosterContainer.opened`)
                  ?.classList.remove("opened");
              }}
            />
            {boosterHistoric.map((booster: any, index: number) => {
              return (
                <div
                  className="HistoricPage-boosterContainer"
                  key={"boosterContainer" + index}
                  id={"booster-" + booster.id}
                  onClick={(ev) => {
                    ev.currentTarget.classList.add("opened");
                    document
                      .querySelector(".HistoricPage-boosterHistoric")
                      ?.classList.add("filter");
                  }}
                >
                  <div className="HistoricPage-booster">
                    <div className="HistoricPage-boosterContent">
                      <div className="HistoricPage-cardList">
                        {booster.cards.map(
                          (
                            card: {
                              name: string;
                              localId: string;
                              type: "reverse" | "classic";
                            },
                            index: number
                          ) => (
                            <div
                              className={"HistoricPage-boosterCardContainer"}
                              key={
                                booster.id + " " + card.localId + " " + index
                              }
                            >
                              {card.type === "reverse" && (
                                <div className="HistoricPage-boosterCardReverseOverlay reverseShining" />
                              )}
                              <img
                                src={getImageFromSeparatedInfos(
                                  card,
                                  booster.cardSet
                                )}
                              />
                            </div>
                          )
                        )}
                      </div>
                      <div className="HistoricPage-topLeft" />
                      <div className="HistoricPage-bottomRight" />
                    </div>
                    <div className="HistoricPage-boosterMain">
                      <div className="HistoricPage-boosterName">
                        {booster.cardSet.name}
                      </div>
                      <div className="HistoricPage-boosterDate">
                        {dayjs(booster.createdAt).format("DD/MM/YYYY")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
