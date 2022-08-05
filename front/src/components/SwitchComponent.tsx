import React from "react";
import {SwitchComponentPropsType} from "../../typing/types";

export const SwitchComponent: React.FC<SwitchComponentPropsType> = ({value, isDisabled, modifyValue, label, id}) => {

  return (
    <div className="Manager-filter-switchInput">
      <label htmlFor={id}
             className={isDisabled ? "Manager-filter-switchInput-disabled" : value ? "Manager-filter-switchInput-activated" : ""}>
        {label}
        <div className={"Manager-filter-switchInput-light"}/>
      </label>
      <input type={"checkbox"} onChange={e => modifyValue(e.target.checked)} id={id}/>
    </div>
  )
}
