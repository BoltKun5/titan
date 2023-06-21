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
}> = ({ card, sets, update }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState(card.name);
  const [cardAdditionalPrinting, setCardAdditionalPrinting] = useState(
    card.cardAdditionalPrinting
  );
  const [setId, setSetId] = useState(card.setId);
  const [localId, setLocalId] = useState(card.localId);
  const [rarity, setRarity] = useState(card.rarity);
  const [types, setTypes] = useState(card.types.map((e) => e.type));
  const [canBeReverse, setCanBeReverse] = useState(card.canBeReverse);
  const [imageId, setImageId] = useState(card.imageId);
  const [thumbnailId, setThumbnailId] = useState(card.thumbnailId);

  const [index, setIndex] = useState<null | number>(null);
  const [_name, _setName] = useState("");
  const [creator, setCreator] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    setName(card.name ?? '');
    setCardAdditionalPrinting(card.cardAdditionalPrinting ?? '');
    setSetId(card.setId ?? '');
    setLocalId(card.localId ?? '');
    setRarity(card.rarity ?? '');
    setTypes(card.types.map((e) => e.type) ?? []);
    setCanBeReverse(card.canBeReverse ?? false);
    setImageId(card.imageId ?? '');
    setThumbnailId(card.thumbnailId ?? '');
  }, [card])

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
        id: card.id,
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

  return (
    <div className="Card">
      <div className="Card-imageContainer">
        <img width={230} height={275} src={getImageSource(card)} />
      </div>
      <div className="Card-inputs">
      <TextField
          value={card.id}
          label={"uniqueID"}
          InputLabelProps={{ shrink: true }}
          disabled />
        <TextField
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          label={"Nom"}
          InputLabelProps={{ shrink: true }} />
        <TextField
          value={localId}
          onChange={(ev) => setLocalId(ev.target.value)}
          label={"ID"}
          InputLabelProps={{ shrink: true }} />
        <TextField
          value={imageId}
          onChange={(ev) => setImageId(ev.target.value)}
          label={"ID image"}
          InputLabelProps={{ shrink: true }} />
        <TextField
          value={thumbnailId}
          onChange={(ev) => setThumbnailId(ev.target.value)}
          label={"ID thumbnail"}
          InputLabelProps={{ shrink: true }} />
        <FormControl>
          <InputLabel htmlFor="grouped-select" shrink>Set</InputLabel>
          <Select
            defaultValue=""
            label="Set"
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
          >
            <MenuItem value={"00000000-0000-0000-0000-000000000000"}>Aucun set</MenuItem>
            {sets.map((e) => [
              <MenuItem value={e.id} key={e.id}>
                {e.name}
              </MenuItem>,
            ])}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="grouped-select" shrink>Rareté</InputLabel>
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
          <InputLabel shrink>Types</InputLabel>
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
          <span style={{ width: 300, margin: 'auto' }}>Versions additionnelles</span>
          <div
            className="Card-add2"
          >
            <TextField
              disabled={index === null}
              value={creator}
              type={"number"}
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }} 
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
              InputLabelProps={{ shrink: true }} 
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
          <div className="d-flex flex-column mx-auto" style={{ width: 300 }}>
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
