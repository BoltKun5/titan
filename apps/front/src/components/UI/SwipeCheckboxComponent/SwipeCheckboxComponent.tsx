import React from "react";
import "./style.scss";
import { SwipeCheckboxComponentType } from "../../../local-core";

export const SwipeCheckboxComponent: React.FC<SwipeCheckboxComponentType> = ({
  label,
  value,
  width,
  elements,
  callback,
}) => {
  const getSelectedElementBgStyle = () => {
    let offset;

    offset = elements.findIndex((el) => el.value === value) * width;

    return { transform: `translateX(${offset}px)`, width };
  };

  return (
    <div className="SwipeCheckboxComponent">
      {label && <label>{label}</label>}
      <div className="SwipeCheckboxComponent-container">
        <div className="SwipeCheckboxComponent-elements">
          {elements.map((element, index) => {
            return (
              <span
                key={"SwipeComponent" + label + index}
                style={{ width: width }}
                onClick={() => callback(element.value)}
                className={
                  value === element.value
                    ? "SwipeCheckboxComponent-optionSelected"
                    : ""
                }
              >
                {element.name}
              </span>
            );
          })}
          <div
            className="SwipeCheckboxComponent-activeElement"
            style={getSelectedElementBgStyle()}
          />
        </div>
      </div>
    </div>
  );
};
