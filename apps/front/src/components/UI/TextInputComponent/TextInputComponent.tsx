import { on } from "events";
import React from "react";
import { TextInputComponentType } from "../../../../../local-core";
import './style.scss'

export const TextInputComponent: React.FC<TextInputComponentType> = (
  { value = null, modifyValue = () => { }, label = "", id = "", type = 'text', onKeyUpCallback = () => { }, onKeyDownCallback = () => { }, width = 250 }) => {
  return (
    <div className="TextInputComponent">
      <label htmlFor={id}>{label}</label>
      {
        value === null ? (
          <input type={type} onChange={e => modifyValue(e.target.value)} id={id} onKeyDown={onKeyDownCallback} onKeyUp={onKeyUpCallback} style={{ width }} />
        ) : (
          <input type={type} value={value} onChange={e => modifyValue(e.target.value)} id={id} onKeyDown={onKeyDownCallback} onKeyUp={onKeyUpCallback} style={{ width }} />
        )
      }
    </div>
  )
}
