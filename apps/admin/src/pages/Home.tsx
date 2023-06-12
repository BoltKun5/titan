import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useFetchData } from "../hook/api/cards";
import { ICard, ICardSerie, ICardSet } from "vokit_core";
import { api, loggedApi } from "../axios";
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import { CardComponent } from "../components/Card/Card";
import { useState, useCallback, useEffect } from "react";
import { SetComponent } from "../components/Set/Set";
import { IceSkating } from "@mui/icons-material";
import { SerieComponent } from "../components/Serie/Serie";

export const Home: React.FC = () => {
  const { fetch } = useFetchData(false);
  const [set, setSet] = useState<string>("");
  const [cards, setCards] = useState<ICard[]>([]);
  const [series, setSeries] = useState<ICardSerie[] | null>(null);
  const [selectedSerieId, setSelectedSerieId] = useState<null | string>(null);

  const [currentSet, setCurrentSet] = useState<undefined | ICardSet>(undefined);
  const [currentCard, setCurrentCard] = useState<undefined | ICard>(undefined);

  const fetchCards = useCallback(async () => {
    if (!set) return;
    const response = await fetch("/card/list", {
      hidden: true,
      setFilter: [set],
      page: -1,
      order: "default",
    });
    setCards(response.data.cards);
  }, [set]);

  const fetchSeries = useCallback(async () => {
    const response = await api.get(`/series/all-series`);
    setSeries(response.data.data);
  }, []);

  useEffect(() => {
    if (!series) {
      fetchSeries();
    }
  }, [series, fetchSeries]);

  useEffect(() => {
    setCards([])
  }, [selectedSerieId])

  useEffect(() => {
    fetchCards();
  }, [set]);

  const currentSerie = series?.find(e => e.id === selectedSerieId)

  return (
    <div className="Home-container">
      <div className="Lists-container">
        <div className={"Series-container"}>
          {<div className={"Cards-element add"} onClick={async () => { await loggedApi.post("series/create-serie"); fetchSeries() }}>
            AJOUTER
          </div>}
          {
            series?.map(e => (
              <div className={"Series-element" + (e.id === selectedSerieId ? ' selected' : '')} onClick={() => { setSelectedSerieId(e.id); setCurrentCard(undefined); setSet(""); setCurrentSet(undefined) }}>
                {e.name}
              </div>
            ))
          }
        </div>
        <div className="Sets-container">
          {selectedSerieId && <div className={"Cards-element add"} onClick={async () => { await loggedApi.post("series/create-set", { cardSerieId: selectedSerieId }); fetchSeries(); }}>
            AJOUTER
          </div>}
          {
            series?.find(e => e.id === selectedSerieId)?.cardSets?.map(e => (
              <div className={"Series-element" + (e.id === currentSet?.id ? ' selected' : '')} onClick={() => { setCurrentSet(e); setSet(e.code); setCurrentCard(undefined); }}>
                {e.name}
              </div>
            ))
          }
        </div>
        <div className="Cards-container">
          {currentSet && <div className={"Cards-element add"} onClick={async () => { await loggedApi.post("card/create", { cardSetId: currentSet.id }); fetchCards(); }}>
            AJOUTER
          </div>}
          {
            cards.sort((a: any, b: any) => {
              return (isNaN(Number(a.localId)) ? a.localId : Number(a.localId)) - (isNaN(Number(b.localId)) ? b.localId : Number(b.localId))
            }).map(e => (
              <div className={"Cards-element" + (e.id === currentCard?.id ? ' selected' : '')} onClick={() => { setCurrentCard(e) }}>
                <span>{e.localId}</span> {e.name}
              </div>
            ))
          }
        </div>
      </div>

      <div className="UpdateData-container">
        {currentCard && <CardComponent
          card={currentCard}
          sets={(series ?? []).map((e) => e?.cardSets ?? []).flat()}
          update={() => fetchCards()}
        />}
        {!currentCard && currentSet && <SetComponent
          set={currentSet}
          series={(series ?? [])}
          update={() => {fetchSeries(); fetchCards()}}
        />}
        {!currentCard && !currentSet && series?.find(e => e.id === selectedSerieId) && <SerieComponent
          serie={series?.find(e => e.id === selectedSerieId) as ICardSerie}
          update={() => fetchSeries()}
        />}
      </div>
    </div>
  );
};
