import React, { useState } from "react";
import "./style.scss";
import { CardPossessionTagSelection } from "../CardPossessionTagSelection/CardPossessionTagSelection";
import { ButtonComponent } from "../UI/Button/ButtonComponent";
import { Comment, Delete, Save } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/material";
import {
  CardVariationConditionEnum,
  CardVariationGradeCompanyEnum,
  ITag,
} from "vokit_core";
import { CardPossessionComponentPropsType } from "../../local-core";

export const CardPossessionComponent: React.FC<CardPossessionComponentPropsType> =
  ({ card, possession, update, delete: destroy, canSave, save, index }) => {
    const cardCondition = CardVariationConditionEnum;
    const gradeCompany = CardVariationGradeCompanyEnum;

    const [isNoteOpened, setIsNoteOpened] = useState(false);
    const [handleDelete, setHandleDelete] = useState(false);

    const handleUpdate = (
      type: "condition" | "grade" | "printingId",
      newValue: any
    ) => {
      let localPossession = { ...possession };
      if (newValue === "") newValue = null;
      else if (type === "condition" || type === "grade")
        newValue = Number(newValue);

      localPossession[type] = newValue;
      update(localPossession);
    };

    return (
      <div
        className="CardPossession"
        style={{ zIndex: card.userCardPossessions.length - index }}
      >
        <div className="CardPossession-container">
          <div className="CardPossession-selectContainer">
            <label>État</label>
            <select
              value={possession?.condition ?? undefined}
              onChange={(ev) => handleUpdate("condition", ev.target.value)}
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
          <div className="CardPossession-buttons">
            <div onClick={() => setIsNoteOpened(!isNoteOpened)}>
              <ButtonComponent
                label={<Comment />}
                height={50}
                size={50}
                color={isNoteOpened ? "green" : "primary"}
              />
            </div>
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
                  height={50}
                  size={50}
                  color={handleDelete ? "red" : "primary"}
                />
              </div>
            </ClickAwayListener>
            <div
              onClick={() => {
                if (canSave) {
                  save(possession.id);
                }
              }}
            >
              <ButtonComponent
                label={<Save />}
                height={50}
                size={50}
                disabled={!canSave}
              />
            </div>
          </div>
        </div>
        <div
          className="CardPossession-note"
          style={{
            height: isNoteOpened ? 80 : 0,
            marginBottom: isNoteOpened ? 10 : 0,
          }}
        >
          <div className="CardPossession-textareaContainer">
            <textarea
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
