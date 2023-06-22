import React from "react";
import './style.scss'
import { TextInputComponentType } from "../../../local-core";

export const TextInputComponent: React.FC<TextInputComponentType> = (
  { value = null, modifyValue = () => { }, label = "", id = "", type = 'text', onKeyUpCallback = () => { }, onKeyDownCallback = () => { }, width = 250, height = 59, labelAsPlaceholder = false, preset = '' }) => {
  return (
    <div className={"TextInputComponent" + (' ' + preset)}>
      {!labelAsPlaceholder && <label htmlFor={id}>{label}</label>}
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
