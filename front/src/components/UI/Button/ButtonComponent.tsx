import React from "react";
import { ButtonComponentPropsType } from "../../../../../local-core";
import './style.scss'

export const ButtonComponent: React.FC<ButtonComponentPropsType> = ({ label, type = undefined, size = 200, disabled = false }) => {
  return (
    <>
      <div className={"ButtonComponent"} style={{ width: size + 20 }}>
        <button disabled={disabled} style={{ width: size }} type={type}>{label}</button>
      </div>
    </>
  )
}
