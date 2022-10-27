import React from "react";
import { ButtonComponentPropsType } from "../../../../../local-core";
import './style.scss'

export const ButtonComponent: React.FC<ButtonComponentPropsType> = ({ label, type = undefined, size = 200 }) => {
  return (
    <div className="ButtonComponent">
      <button type={type}>{label}</button>
    </div>
  )
}
