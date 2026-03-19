import { MouseEventHandler } from "react";

export type SwitchInputComponentPropsType = {
  value: boolean;
  isDisabled: boolean;
  modifyValue: Function;
  label: string;
  id: string;
};

export type TextInputComponentType = {
  value?: string;
  modifyValue?: Function;
  label?: string;
  id?: string;
  type?: string;
  onKeyUpCallback?: any;
  onKeyDownCallback?: any;
  width?: number;
  height?: number;
  labelAsPlaceholder?: boolean;
  preset?: string;
  tooltip?: string;
  placeholder?: string;
};

export type ButtonComponentPropsType = {
  label: any;
  type?: "button" | "submit" | "reset" | undefined;
  size?: number;
  disabled?: boolean;
  height?: number;
  color?: "primary" | "green" | "red" | "secondary";
  style?: any;
  className?: string;
  weight?: number | string;
  fontSize?: number;
  preset?: string;
  clipPath?: number;
  hoverOffset?: number;
  callback?: MouseEventHandler<HTMLButtonElement>;
};

export type SwipeCheckboxComponentType = {
  label?: string;
  disabled?: boolean;
  callback: Function;
  elements: { value: any; name: string }[];
  value: any;
  width: number;
  preset?: string;
};
  update: Function;
  delete: Function;
  canSave: boolean;
  save: Function;
  index: number;
};
