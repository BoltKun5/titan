import React from "react";
import "./style.scss";
import { ButtonComponentPropsType } from "../../../local-core";

export const ButtonComponent: React.FC<ButtonComponentPropsType> = ({
  label,
  type = undefined,
  size = 220,
  disabled = false,
  height: h = 50,
  color = "primary",
}) => {
  return (
    <>
      <div
        className={
          "ButtonComponent" + (disabled ? " disabled" : "") + (" " + color)
        }
        style={{ width: size, height: h }}
      >
        <button
          disabled={disabled}
          style={{ width: size, height: h }}
          type={type}
        >
          {label}
        </button>
      </div>
    </>
  );
};
