import React from "react";
import "./style.scss";
import { SwitchInputComponentPropsType } from "../../local-core";

export const SwitchInputComponent: React.FC<SwitchInputComponentPropsType> = ({
  value,
  isDisabled,
  modifyValue,
  label,
  id,
}) => {
  return (
    <div className="SwitchInput">
      <label
        htmlFor={id}
        className={
          isDisabled
            ? "SwitchInput-disabled"
            : value
            ? "SwitchInput-activated"
            : ""
        }
      >
        {label}
        <div className={"SwitchInput-light"} />
      </label>
      <input
        type={"checkbox"}
        checked={value}
        onChange={(e) => modifyValue(e.target.checked)}
        id={id}
      />
    </div>
  );
};
