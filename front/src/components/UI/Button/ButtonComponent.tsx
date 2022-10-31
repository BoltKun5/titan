import React from "react";
import { ButtonComponentPropsType } from "../../../../../local-core";
import './style.scss'

export const ButtonComponent: React.FC<ButtonComponentPropsType> = ({ label, type = undefined, size = 200, disabled = false }) => {
  return (
    <>
      <div className={"ButtonComponent"}>
        <button disabled={disabled} type={type} style={{ width: size }}>{label}</button>
      </div>
    </>
  )
}
