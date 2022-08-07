import React from "react";
import {SwitchInputComponentPropsType} from "../../../typing/types";
import './SwitchInputComponent.scss'

export const SwitchInputComponent: React.FC<SwitchInputComponentPropsType> = ({value, isDisabled, modifyValue, label, id}) => {

  return (
    <div className="SwitchInput">
      <label htmlFor={id}
             className={isDisabled ? "SwitchInput-disabled" : value ? "SwitchInput-activated" : ""}>
        {label}
        <div className={"SwitchInput-light"}/>
      </label>
      <input type={"checkbox"} onChange={e => modifyValue(e.target.checked)} id={id}/>
    </div>
  )
}
