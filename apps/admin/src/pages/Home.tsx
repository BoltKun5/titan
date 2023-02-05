import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useFetchData } from "../hook/api/cards";
import { ICard, ICardSerie } from "vokit_core";
import { api } from "../axios";
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import { CardComponent } from "../components/Card/Card";
import StoreContext from "../hook/contexts/StoreContext";

export const Home: React.FC = () => {
  //#region Accordéon
  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary {...props} />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  //#endregion

  const { isLoading, fetch } = useFetchData(false);
  const [set, setSet] = React.useState<string>("");
  const [cards, setCards] = React.useState<ICard[]>([]);
  const [series, setSeries] = React.useState<ICardSerie[] | null>(null);

  const fetchCards = React.useCallback(async () => {
    if (!set) return;
    const response = await fetch("/card/list", {
      setFilter: [set],
      page: -1,
      order: "default",
    });
    setCards(response.data.cards);
  }, [set]);

  const fetchSeries = React.useCallback(async () => {
    const response = await api.get(`/series/all-series`);
    setSeries(response.data.data);
  }, []);

  React.useEffect(() => {
    if (!series) {
      fetchSeries();
    }
  }, [series, fetchSeries]);

  React.useEffect(() => {
    fetchCards();
  }, [set]);

  return (
    <div className="w-100 d-flex flex-column">
      <FormControl
        sx={{ m: 2, minWidth: 250, maxWidth: 300, margin: "10px auto" }}
      >
        <InputLabel htmlFor="grouped-select">Set</InputLabel>
        <Select
          defaultValue=""
          label="Set"
          value={set}
          onChange={(e) => setSet(e.target.value)}
        >
          {(series ?? []).map((e) => [
            <ListSubheader>{e.name}</ListSubheader>,
            (e.cardSets ?? []).map((_e) => [
              <MenuItem value={_e.code}>{_e.name}</MenuItem>,
            ]),
          ])}
        </Select>
      </FormControl>
      <div
        className="container overflow-auto border-1 border"
        style={{ height: "80vh" }}
      >
        {cards.map((_card, index) => (
          <Accordion
            key={_card.id}
            expanded={expanded === _card.id}
            onChange={handleChange(_card.id)}
          >
            <AccordionSummary>
              #{_card.localId} - {_card.name}
            </AccordionSummary>
            {expanded === _card.id && (
              <AccordionDetails>
                <CardComponent
                  key={_card.id}
                  card={_card}
                  sets={(series ?? []).map((e) => e?.cardSets ?? []).flat()}
                  update={(card: ICard) => {
                    const __cards = [...cards];
                    __cards[index] = card;
                    setCards(__cards);
                  }}
                />
              </AccordionDetails>
            )}
          </Accordion>
        ))}
      </div>
    </div>
  );
};
