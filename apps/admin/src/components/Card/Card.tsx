import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  CardRarityEnumFrench,
  CardTypeEnum,
  CardTypeEnumFrench,
  ICard,
  ICardSet,
} from "vokit_core";
import { getImageSource } from "../../general.utils";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  styled,
} from "@mui/material";
import "./style.scss";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Delete } from "@mui/icons-material";
import { loggedApi } from "../../axios";

export const CardComponent: React.FC<{
  card: ICard;
  sets: ICardSet[];
  update: Function;
}> = ({ card: _card, sets, update }) => {
  const { enqueueSnackbar } = useSnackbar();

  const card = { ..._card };

  const [name, setName] = useState(card.name);
  const [cardAdditionalPrinting, setCardAdditionalPrinting] = useState(
    card.cardAdditionalPrinting
  );
  const [setId, setSetId] = useState(card.setId);
  const [localId, setLocalId] = useState(card.localId);
  const [rarity, setRarity] = useState(card.rarity);
  const [types, setTypes] = useState(card.types.map((e) => e.type));
  const [canBeReverse, setCanBeReverse] = useState(card.canBeReverse);

  const [index, setIndex] = useState<null | number>(null);
  const [_name, _setName] = useState("");
  const [creator, setCreator] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (index !== null) {
      _setName((cardAdditionalPrinting[index]?.name as any) ?? "");
      setCreator((cardAdditionalPrinting[index]?.creator as any) ?? "");
      setType((cardAdditionalPrinting[index]?.type as any) ?? "");
    } else {
      _setName("");
      setCreator("");
      setType("");
    }
  }, [index]);

  useEffect(() => {
    setCanBeReverse(
      cardAdditionalPrinting.find(
        (e) => Number(e.type) === 0 && (e.type as any) !== ""
      ) !== undefined
    );
  }, [cardAdditionalPrinting]);

  const handleSubmit = async () => {
    try {
      const params: any = {
        id: _card.id,
        name,
        rarity,
        localId,
        setId,
        types,
        canBeReverse,
        cardAdditionalPrinting,
      };

      const newCard = (await loggedApi.post("/card/update", params)).data.data
        .card;

      update(newCard);
    } catch (e: any) {
      enqueueSnackbar(e.message);
    }
  };

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

  return (
    <div className="Card">
      <div>
        <img src={getImageSource(card)} />
      </div>
      <div className="Card-inputs">
        <TextField
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          label={"Nom"}
        />
        <TextField
          value={localId}
          onChange={(ev) => setLocalId(ev.target.value)}
          label={"ID"}
        />
        <FormControl>
          <InputLabel htmlFor="grouped-select">Set</InputLabel>
          <Select
            defaultValue=""
            label="Set"
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
          >
            {sets.map((e) => [
              <MenuItem value={e.id} key={e.id}>
                {e.name}
              </MenuItem>,
            ])}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="grouped-select">Rareté</InputLabel>
          <Select
            defaultValue=""
            label="Rareté"
            value={rarity as any}
            onChange={(e) => setRarity(e.target.value as any)}
          >
            {Object.values(CardRarityEnumFrench).map((el: any) => {
              if (typeof el !== "number") {
                return (
                  <MenuItem key={el} value={CardRarityEnumFrench[el]}>
                    {el}
                  </MenuItem>
                );
              }
            })}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel>Types</InputLabel>
          <Select
            multiple
            value={types}
            onChange={(ev) => setTypes(ev.target.value as any)}
            input={<OutlinedInput label="Types" />}
            renderValue={(selected) =>
              types.map((e) => CardTypeEnumFrench[e as any]).join(", ")
            }
          >
            {Object.values(CardTypeEnumFrench).map((type) => {
              if (typeof type !== "number") {
                return (
                  <MenuItem key={type} value={CardTypeEnumFrench[type as any]}>
                    <Checkbox
                      checked={
                        types.indexOf(CardTypeEnumFrench[type as any] as any) >
                        -1
                      }
                    />
                    <ListItemText primary={type} />
                  </MenuItem>
                );
              }
            })}
          </Select>
        </FormControl>
        <div className="d-flex align-items-center justify-content-center">
          Existe en reverse
          <Switch checked={canBeReverse} sx={{ pointerEvents: "none" }} />
        </div>
        <div className="Card-add">
          <span>Versions additionnelles</span>
          <div
            style={{
              height: 140,
            }}
            className="Card-add2"
          >
            <TextField
              disabled={index === null}
              value={creator}
              type={"number"}
              onChange={(ev) => {
                if (index !== null) {
                  const _array = [...cardAdditionalPrinting];
                  _array[index].creator = ev.target.value as any;
                  setCardAdditionalPrinting(_array);
                  setCreator(ev.target.value);
                }
              }}
              label={"Créateur"}
            />
            <TextField
              disabled={index === null}
              value={_name}
              onChange={(ev) => {
                if (index !== null) {
                  const _array = [...cardAdditionalPrinting];
                  _array[index].name = ev.target.value as any;
                  setCardAdditionalPrinting(_array);
                  _setName(ev.target.value);
                }
              }}
              label={"Nom"}
            />
            <TextField
              disabled={index === null}
              value={type}
              type={"number"}
              onChange={(ev) => {
                if (index !== null) {
                  const _array = [...cardAdditionalPrinting];
                  _array[index].type = ev.target.value as any;
                  setCardAdditionalPrinting(_array);
                  setType(ev.target.value);
                }
              }}
              label={"Type"}
            />
            {cardAdditionalPrinting.map((_card, _index) => (
              <div
                key={_index}
                className="Card-printings"
                style={{
                  ...(_index === index ? { backgroundColor: "#1976d2" } : {}),
                }}
                onClick={() => {
                  setIndex(_index);
                }}
              >
                {_card.name} - {_card.type} par {_card.creator}
                <Button
                  size="small"
                  sx={{ minWidth: 30, margin: "0 5px 0 auto" }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    const _array = [...cardAdditionalPrinting];
                    _array.splice(_index, 1);
                    setCardAdditionalPrinting(_array);
                    if (index === _index) {
                      setIndex(null);
                    }
                  }}
                >
                  <Delete color="warning" />
                </Button>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end">
            <Button
              variant="contained"
              sx={{ margin: 1 }}
              onClick={() => {
                setCardAdditionalPrinting([
                  ...cardAdditionalPrinting,
                  { creator: "", name: "", type: "" },
                ] as any);
              }}
            >
              Ajouter une version
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ margin: 1 }}
              onClick={handleSubmit}
            >
              Push
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
