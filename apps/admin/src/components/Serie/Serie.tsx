import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  ICardSerie,
} from "vokit_core";
import {
  Button,
  TextField,
} from "@mui/material";
import "./style.scss";
import { loggedApi } from "../../axios";

export const SerieComponent: React.FC<{
  serie: ICardSerie;
  update: Function;
}> = ({ serie, update }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState(serie.name);
  const [code, setCode] = useState(serie.code);
  const [data, setData] = useState('')

  useEffect(() => {
    setName(serie?.name ?? '');
    setCode(serie?.code ?? '');
  }, [serie])

  const handleSubmit = async () => {
    try {
      const params: any = {
        id: serie.id,
        name,
        code,
      };
      await loggedApi.post("/series/update-serie", params)
      update();
    } catch (e: any) {
      enqueueSnackbar(e.message);
    }
  };

  const handleImport = async () => {
    try {
      const params: any = {
        id: serie.id,
        data: JSON.parse(data)
      };

      await loggedApi.post("/series/import-serie-data", params)
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
          disabled
          value={serie.id}
          onChange={(ev) => setCode(ev.target.value)}
          label={"Code"}
          InputLabelProps={{ shrink: true }} />
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
