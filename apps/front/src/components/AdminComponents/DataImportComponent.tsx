import React, { useCallback, useContext, useEffect, useState } from "react";
import { loggedApi } from "../../axios";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import { Loader } from "../UI/Loader/LoaderComponent";
import { TextInputComponent } from "../UI/TextInputComponent/TextInputComponent";
import "./style.scss";
import { IAdminConfig } from "vokit_core";

export const DataImportComponent: React.FC = () => {
  const [setRename, setSetRename] = useState<IAdminConfig[] | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [type, setType] = useState<"edit" | "create">("create");
  const [isError, setIsError] = useState(false);

  const fetchRenames = useCallback(async () => {
    setType("create");
    setRenameName("");
    setRenameValue("");
    setSelectedId(null);
    const response = await loggedApi.get("admin/dataImportSetRename");
    setSetRename((response as any).data.data);
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

  const forceImportData = () => {
    try {
      loggedApi.get("admin/force-import-data");
    } catch (e) {
      console.log(e);
    }
  };

  const submit = async () => {
    try {
      await loggedApi.post("admin/dataImportSetRename", {
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
      await loggedApi.delete("admin/dataImportSetRename?id=" + selectedId);
      fetchRenames();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="DataImport">
      {setRename === null ? (
        <Loader />
      ) : (
        <>
          <div className="DataImport-setRenames">
            {setRename.map((localSetRename) => (
              <div
                className={
                  "DataImport-setRename " +
                  (selectedId === localSetRename.id ? "selected" : "")
                }
                key={localSetRename.id}
                onClick={() => {
                  setType("edit");
                  setRenameName(localSetRename.name);
                  setSelectedId(localSetRename.id);
                  setRenameValue(localSetRename.value);
                }}
              >
                <span>{localSetRename.name}</span>
                <span>{localSetRename.value}</span>
              </div>
            ))}
          </div>
          <div className="DataImport-buttons">
            <div onClick={() => importTestData()}>
              <ButtonComponent label={"Données de test"} />
            </div>
            <div onClick={() => forceImportData()}>
              <ButtonComponent label={"Forcer un import"} />
            </div>
            <div onClick={() => createRename()}>
              <ButtonComponent label={"Créer un rename"} />
            </div>
            <div className="DataImport-renameEdition">
              <TextInputComponent
                value={renameName}
                modifyValue={setRenameName}
                label="Nom"
                width={150}
                id="name"
              />
              <TextInputComponent
                value={renameValue}
                modifyValue={setRenameValue}
                label="Valeur"
                width={150}
                id="value"
              />
              <div onClick={() => submit()}>
                <ButtonComponent
                  label={type === "edit" ? "Modifier" : "Créer"}
                  size={150}
                  disabled={isError}
                />
              </div>
              {type === "edit" && (
                <div
                  onClick={() => {
                    destroy();
                  }}
                  style={{ margin: 10 }}
                >
                  <ButtonComponent label={"Supprimer"} size={150} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
