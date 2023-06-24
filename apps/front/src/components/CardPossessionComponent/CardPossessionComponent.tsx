import React, { useState } from "react";
import "./style.scss";
import { CardPossessionTagSelection } from "../CardPossessionTagSelection/CardPossessionTagSelection";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import { Comment, Delete, Save } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/material";
import {
  CardPossessionLanguageEnum,
  CardPossessionConditionEnum,
  CardPossessionGradeCompanyEnum,
  ITag,
  IUserCardPossession,
} from "vokit_core";
import { CardPossessionComponentPropsType } from "../../local-core";
import { isUnloggedPage } from "../../general.utils";

export const CardPossessionComponent: React.FC<CardPossessionComponentPropsType> =
  ({ card, possession, update, delete: destroy, canSave, save, index }) => {
    const cardCondition = CardPossessionConditionEnum;
    const gradeCompany = CardPossessionGradeCompanyEnum;
    const languages = CardPossessionLanguageEnum;

    const [isNoteOpened, setIsNoteOpened] = useState(false);
    const [handleDelete, setHandleDelete] = useState(false);

    const handleUpdate = (
      type: "condition" | "grade" | "printingId" | "language",
      newValue: any
    ) => {
      let localPossession: IUserCardPossession = { ...possession };
      if (newValue === "") newValue = null;
      else if (type === "condition" || type === "grade" || type === "language")
        newValue = Number(newValue);
      localPossession[type] = newValue;
      const a = localPossession[type];
      update(localPossession);
    };

    return (
      <div
        className="CardPossession"
        style={{ zIndex: card.userCardPossessions.length - index }}
      >
        <div className="CardPossession-container">
          <div className="CardPossession-selectorsContainer">
            <div className="CardPossession-selectContainer">
              <label>État</label>
              <select
                value={possession?.condition ?? undefined}
                onChange={(ev) => handleUpdate("condition", ev.target.value)}
                style={
                  isUnloggedPage()
                    ? {
                      MozAppearance: "none",
                      WebkitAppearance: "none",
                      pointerEvents: "none",
                    }
                    : {}
                }
              >
                <option value={""}>-</option>
                {Object.entries(cardCondition)
                  .filter((condition) => !isNaN(Number(condition[0])))
                  .map((condition, index) => (
                    <option
                      key={"condition" + index}
                      value={Number(condition[0])}
                    >
                      {condition[1]}
                    </option>
                  ))}
              </select>
            </div>
            <div className="CardPossession-selectContainer">
              <label>Gradage</label>
              <select
                value={possession?.grade ?? undefined}
                onChange={(ev) => handleUpdate("grade", ev.target.value)}
                style={
                  isUnloggedPage()
                    ? {
                      MozAppearance: "none",
                      WebkitAppearance: "none",
                      pointerEvents: "none",
                    }
                    : {}
                }
              >
                <option value={""}>-</option>
                {Object.entries(gradeCompany)
                  .filter((condition) => !isNaN(Number(condition[0])))
                  .map((condition, index) => (
                    <option key={"grade" + index} value={Number(condition[0])}>
                      {condition[1]}
                    </option>
                  ))}
              </select>
            </div>
            <div className="CardPossession-selectContainer">
              <label>Version</label>
              <select
                value={possession?.printingId ?? undefined}
                onChange={(ev) => handleUpdate("printingId", ev.target.value)}
                style={
                  isUnloggedPage()
                    ? {
                      MozAppearance: "none",
                      WebkitAppearance: "none",
                      pointerEvents: "none",
                    }
                    : {}
                }
              >
                <option value={""}>Classique</option>
                {card.cardAdditionalPrinting.map((print, index) => (
                  <option key={"printing" + index} value={print.id}>
                    {print.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="CardPossession-selectContainer">
              <label>Langue</label>
              <select
                value={possession?.language ?? undefined}
                onChange={(ev) => handleUpdate("language", ev.target.value)}
                style={
                  isUnloggedPage()
                    ? {
                      MozAppearance: "none",
                      WebkitAppearance: "none",
                      pointerEvents: "none",
                    }
                    : {}
                }
              >
                <option value={""}>-</option>
                {Object.entries(languages)
                  .filter((condition) => !isNaN(Number(condition[0])))
                  .map((condition, index) => (
                    <option key={"grade" + index} value={Number(condition[0])}>
                      {condition[1]}
                    </option>
                  ))}
              </select>
            </div>
            <div className="CardPossession-selectContainer labels"
              style={
                isUnloggedPage()
                  ? {
                    pointerEvents: "none",
                  }
                  : {}
              }
            >
              <label>Labels</label>
              <CardPossessionTagSelection
                cardPossession={possession}
                onTagChange={(tag: ITag) => {
                  let localTags = [...(possession?.tags ?? [])];
                  const index = localTags.findIndex(
                    (localTag) => localTag.id === tag.id
                  );
                  if (index !== -1) {
                    localTags.splice(index, 1);
                  } else {
                    localTags.push(tag);
                  }
                  const newPossession = { ...possession };
                  newPossession.tags = localTags;
                  update(newPossession);
                }}
              />
            </div>
          </div>
          <div className="CardPossession-buttons">
            <div onClick={() => setIsNoteOpened(!isNoteOpened)}>
              <ButtonComponent
                label={<Comment />}
                height={40}
                size={40}
                clipPath={10}
                color={isNoteOpened ? "green" : "primary"}
              />
            </div>
            {!isUnloggedPage() && (
              <ClickAwayListener
                onClickAway={() => {
                  if (handleDelete) setHandleDelete(false);
                }}
              >
                <div
                  onClick={() => {
                    if (!handleDelete) setHandleDelete(true);
                    else {
                      destroy(possession.id);
                      setHandleDelete(false);
                    }
                  }}
                >
                  <ButtonComponent
                    label={<Delete />}
                    height={40}
                    size={40}
                    clipPath={10}
                    color={handleDelete ? "red" : "primary"}
                  />
                </div>
              </ClickAwayListener>
            )}
            <div
              onClick={() => {
                if (canSave) {
                  save(possession.id);
                }
              }}
            >
              {!isUnloggedPage() && (
                <ButtonComponent
                  label={<Save />}
                  height={40}
                  size={40}
                  clipPath={10}
                  disabled={!canSave}
                />
              )}
            </div>
          </div>
        </div>
        <div className="CardPossession-note"
          style={{
            height: isNoteOpened ? 80 : 0,
            marginBottom: isNoteOpened ? 10 : 0,
          }}
        >
          <div className="CardPossession-textareaContainer">
            <textarea
              readOnly={isUnloggedPage()}
              value={possession.note ?? ""}
              onChange={(ev) => {
                let localPossession = { ...possession };
                localPossession.note = ev.target.value;
                if (localPossession.note === "") localPossession.note = null;
                update(localPossession);
              }}
            ></textarea>
          </div>
        </div>
      </div>
    );
  };
