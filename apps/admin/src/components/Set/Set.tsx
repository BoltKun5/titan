import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  ICardSerie,
  ICardSet,
} from "vokit_core";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import "./style.scss";
import { loggedApi } from "../../axios";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

export const SetComponent: React.FC<{
  set: ICardSet;
  series: ICardSerie[];
  update: Function;
}> = ({ set, series, update }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState(set.name ?? '');
  const [cardSerieId, setCardSerieId] = useState(set.cardSerieId ?? '');
  const [releaseDate, setReleaseDate] = useState(set.releaseDate ?? '');
  const [logoId, setLogoId] = useState(set.logoId ?? '');
  const [imageId, setImageId] = useState(set.imageId ?? '');
  const [code, setCode] = useState(set.code ?? '');
  const [data, setData] = useState('');
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);

  useEffect(() => {
    setName(set.name ?? '');
    setCardSerieId(set.cardSerieId ?? '');
    setReleaseDate(set.releaseDate ?? null);
    setCode(set.code ?? '');
    setData('')
  }, [set])

  const handleSubmit = async () => {
    try {
      const params: any = {
        id: set.id,
        name,
        cardSerieId,
        releaseDate,
        code,
        imageId,
        logoId
      };

      const newCard = (await loggedApi.post("/series/update-set", params)).data.data
        .card;

      update(newCard);
    } catch (e: any) {
      enqueueSnackbar(e.message);
    }
  };

  const handleImport = async () => {
    try {
      const params: any = {
        id: set.id,
        data: JSON.parse(data),
        ignoreDuplicate
      };

      await loggedApi.post("/series/import-data", params)
      // update();
    } catch (e: any) {
      enqueueSnackbar(e.message);
    }
  };

  return (
    <div className="Card">
      <div className="Card-inputs">
        <TextField
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          label={"Nom"}
          InputLabelProps={{ shrink: true }} />
        <TextField
          value={code}
          onChange={(ev) => setCode(ev.target.value)}
          label={"Code"}
          InputLabelProps={{ shrink: true }} />
        <TextField
          value={logoId}
          onChange={(ev) => setLogoId(ev.target.value)}
          label={"logoId"}
          InputLabelProps={{ shrink: true }} />
        <TextField
          value={imageId}
          onChange={(ev) => setImageId(ev.target.value)}
          label={"imageId"}
          InputLabelProps={{ shrink: true }} />
        <LocalizationProvider dateAdapter={AdapterDayjs}> <DatePicker
          value={dayjs(releaseDate)}
          onChange={(newValue) => { if (newValue) setReleaseDate(newValue.toDate()) }}
          label={"ID"}
          format="DD/MM/YYYY"
        />
        </LocalizationProvider>
        <FormControl>
          <InputLabel htmlFor="grouped-select">Série</InputLabel>
          <Select
            defaultValue=""
            label="Set"
            value={cardSerieId}
            onChange={(e) => setCardSerieId(e.target.value)}
          >
            <MenuItem value={"00000000-0000-0000-0000-000000000000"}>Aucune série</MenuItem>
            {series.map((e) => [
              <MenuItem value={e.id} key={e.id}>
                {e.name}
              </MenuItem>,
            ])}
          </Select>
        </FormControl>
      </div>
      <div className="d-flex flex-column mx-auto" style={{ width: 300 }}>
        <Button
          variant="contained"
          color="warning"
          sx={{ margin: 1 }}
          onClick={handleSubmit}
        >
          Push
        </Button>
      </div>
      <div className="Card-inputs">
        <TextField
          value={data}
          onChange={(ev) => setData(ev.target.value)}
          multiline
          maxRows={10}
          minRows={10}
          InputLabelProps={{ shrink: true }} />
        <FormControlLabel control={<Switch value={ignoreDuplicate} onChange={(e: any) => setIgnoreDuplicate(e.target.checked)} />} label="Ignore les duplicats" />
      </div>
      <div className="d-flex flex-column mx-auto" style={{ width: 300 }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ margin: 1 }}
          onClick={handleImport}
        >
          Importer
        </Button>
      </div>
    </div>
  );
};
