import { MouseEventHandler } from "react";
import { ICardSerie, ICard, IUserCardPossession } from "../../../../packages/core/src";


export type SideBarComponentPropsType = {
  series: ICardSerie[];
};

export type SwitchInputComponentPropsType = {
  value: boolean;
  isDisabled: boolean;
  modifyValue: Function;
  label: string;
  id: string;
};

export type SingleCardComponentPropsType = {
  card: ICard;
  index: number;
  firstType: "classic" | "reverse";
  style?: string;
  setModal: Function;
  modal: ICard | null;
};

export type SingleCardOverlayComponentPropsType = {
  card: ICard;
  index: number;
  firstType: "classic" | "reverse";
};

export type CardCounterComponentPropsType = {
  card: ICard;
  label: string;
  type: "classic" | "reverse";
  canBeReverse: boolean;
};

export type SingleCardOverlayContentComponentPropsType = {
  card: ICard;
  index: number;
  firstType: "classic" | "reverse";
};

export type StatCardComponentType = {
  data: {
    icon?: string;
    ownedQuantity: number;
    distinctQuantity: number;
    possibleQuantity: number;
    label: string;
  };
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

export type CardPossessionComponentPropsType = {
  card: ICard;
  possession: IUserCardPossession;
  update: Function;
  delete: Function;
  canSave: boolean;
  save: Function;
  index: number;
};
