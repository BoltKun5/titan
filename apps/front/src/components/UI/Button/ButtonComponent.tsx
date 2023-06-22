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
  style,
  className,
  weight = 'normal',
  fontSize = 20,
  preset = 'primary',
  clipPath = 18,
  hoverOffset = 3
}) => {
  const externalClipPath = clipPath + hoverOffset
  return (
    <>
      <div
        className={
          "ButtonComponent" + (disabled ? " disabled" : "") + (" " + color)
        }
        style={{ width: size, height: h, '--clipPathValue': `${externalClipPath}px` } as any}
      >
        <button
          disabled={disabled}
          style={{ width: size, height: h, ...style, fontWeight: weight, fontSize, '--clipPathValue': clipPath + 'px' }}
          type={type}
          className={className ?? ''}
        >
          {label}
        </button>
      </div>
    </>
  );
};
