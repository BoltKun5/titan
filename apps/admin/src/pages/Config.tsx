import React, { useCallback, useEffect, useState } from "react";
import {
  IAdminConfig,
  IGetSetRenameAdminResponse,
  IResponse,
} from "vokit_core";
import axios, { AxiosResponse } from "axios";
import { loggedApi } from "../axios";
import { Button, Checkbox, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CheckBox } from "@mui/icons-material";

export const Config: React.FC = () => {
  const [setRename, setSetRename] = useState<IAdminConfig[] | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [type, setType] = useState<"edit" | "create">("create");
  const [isError, setIsError] = useState(false);
  const [totalSets, setTotalSets] = useState<any[]>([]);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);

  const fetchRenames = useCallback(async () => {
    setType("create");
    setRenameName("");
    setRenameValue("");
    setSelectedId(null);
    const response: AxiosResponse<IResponse<IGetSetRenameAdminResponse>> =
      await loggedApi.get("admin/data-set-rename");
    setSetRename(response.data.data.renames);
  }, []);

  const fetchTotal = useCallback(async () => {
    const response = await axios.get("https://api.tcgdex.net/v2/fr/sets");
    setTotalSets(response.data);
  }, []);

  useEffect(() => {
    fetchTotal();
  }, []);

  useEffect(() => {
    if (type === "create") {
      if (
        setRename &&
        setRename?.filter(
          (localSetRename) => localSetRename.value === renameValue
        ).length > 0
      ) {
        setIsError(true);
      } else {
        setIsError(false);
      }
    }
    if (!setRename) {
      fetchRenames();
    }
  });

  const importTestData = () => {
    try {
      loggedApi.get("admin/import-test-data");
    } catch (e) {
      console.log(e);
    }
  };

  const importData = () => {
    try {
      loggedApi.post("admin/import-data", {
        setId: selectedSets,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const submit = async () => {
    try {
      await loggedApi.post("admin/data-set-rename", {
        value: renameValue,
        name: renameName,
        ...(selectedId ? { id: selectedId } : {}),
      });
      fetchRenames();
    } catch (e) {
      console.log(e);
    }
  };

  const createRename = () => {
    setType("create");
    setRenameName("");
    setRenameValue("");
    setSelectedId(null);
  };

  const destroy = async () => {
    try {
      await loggedApi.delete("admin/data-set-rename?id=" + selectedId);
      fetchRenames();
    } catch (e) {
      console.log(e);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#383838",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div className="DataImport">
      {setRename === null ? (
        <div />
      ) : (
        <div className="d-flex container">
          <div style={{ maxHeight: 800, overflow: "auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Nom de base
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Nouveau nom
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {setRename.map((_setRename) => (
                    <StyledTableRow
                      key={_setRename.name}
                      onClick={() => {
                        setType("edit");
                        setRenameName(_setRename.name);
                        setSelectedId(_setRename.id);
                        setRenameValue(_setRename.value);
                      }}
                    >
                      <StyledTableCell align="center">
                        {_setRename.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {_setRename.value}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div
            className="mx-2 d-flex flex-column justify-content-center bg-light p-4"
            style={{ height: 350 }}
          >
            <div
              onClick={() => importTestData()}
              style={{ margin: "5px auto" }}
            >
              <Button variant="contained">Test data</Button>
            </div>
            <div onClick={() => importData()} style={{ margin: "5px auto" }}>
              <Button variant="contained">Importer</Button>
            </div>
            <div onClick={() => createRename()} style={{ margin: "5px auto" }}>
              <Button variant="contained">Créer un rename</Button>
            </div>
            <div className="d-flex flex-column">
              <TextField
                value={renameName}
                onChange={(ev) => setRenameName(ev.target.value)}
                label="Nom"
                id="name"
                style={{ margin: "5px auto" }}
              />
              <TextField
                value={renameValue}
                onChange={(ev) => setRenameValue(ev.target.value)}
                label="Valeur"
                id="value"
              />
              <div onClick={() => submit()} style={{ margin: "5px auto" }}>
                <Button variant="contained" disabled={isError}>
                  {type === "edit" ? "Modifier" : "Créer"}
                </Button>
              </div>
              {type === "edit" && (
                <div
                  style={{ margin: "5px auto" }}
                  onClick={() => {
                    destroy();
                  }}
                >
                  <Button variant="contained">Supprimer</Button>
                </div>
              )}
              <div
                style={{ margin: "5px auto" }}
                onClick={() => {
                  destroy();
                }}
              >
                <a
                  href="https://localhost:10101/cards/base1"
                  download
                  target={"_blank"}
                >
                  <Button variant="contained">Images</Button>
                </a>
              </div>
            </div>
          </div>
          <div style={{ maxHeight: 800, overflow: "auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Nom du set</StyledTableCell>
                    <StyledTableCell align="center">ID du set</StyledTableCell>
                    <StyledTableCell align="center">
                      <Checkbox
                        checked={totalSets.length === selectedSets.length}
                        onClick={() => {
                          if (totalSets.length === selectedSets.length) {
                            setSelectedSets([]);
                          } else {
                            setSelectedSets(totalSets.map((e) => e.id));
                          }
                        }}
                      />
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {totalSets.map((_setRename) => (
                    <StyledTableRow
                      key={_setRename.name}
                      onClick={() => {
                        if (selectedSets.includes(_setRename.id)) {
                          setSelectedSets(
                            selectedSets.filter((e) => e !== _setRename.id)
                          );
                        } else {
                          setSelectedSets([...selectedSets, _setRename.id]);
                        }
                      }}
                    >
                      <StyledTableCell align="center">
                        {_setRename.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {_setRename.id}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedSets.includes(_setRename.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </div>
  );
};
