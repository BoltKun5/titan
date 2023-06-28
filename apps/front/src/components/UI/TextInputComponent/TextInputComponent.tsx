import React from "react";
import './style.scss'
import { TextInputComponentType } from "../../../local-core";
import { Info } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const TextInputComponent: React.FC<TextInputComponentType> = (
  { value = null, modifyValue = () => { }, label = "", id = "", type = 'text', onKeyUpCallback = () => { }, onKeyDownCallback = () => { }, width = 250, height = 59, labelAsPlaceholder = false, preset = '', tooltip }) => {
  return (
    <div className={"TextInputComponent" + (' ' + preset)}>

      {!labelAsPlaceholder && <label htmlFor={id}>{label}
        {
          tooltip && <Tooltip title={tooltip}><Info /></Tooltip>
        }</label>}
      {
        value === null ? (
          <input
            type={type}
            onChange={e => modifyValue(e.target.value)}
            id={id} onKeyDown={onKeyDownCallback}
            onKeyUp={onKeyUpCallback}
            style={{ width, height, boxSizing: 'border-box' }}
            placeholder={labelAsPlaceholder ? label : ''}
          />
        ) : (
          <input
            value={value}
            type={type}
            onChange={e => modifyValue(e.target.value)}
            id={id}
            onKeyDown={onKeyDownCallback}
            onKeyUp={onKeyUpCallback}
            style={{ width, height, boxSizing: 'border-box' }}
            placeholder={labelAsPlaceholder ? label : ''}
          />
        )
      }
    </div>
  )
}
