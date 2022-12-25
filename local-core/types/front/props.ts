import { ICardSerie, ICard, IUserCardPossession } from "../../../local-core";

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
};

export type ButtonComponentPropsType = {
  label: any;
  type?: "button" | "submit" | "reset" | undefined;
  size?: number;
  disabled?: boolean;
  height?: number;
  color?: "primary" | "green" | "red";
};

export type SwipeCheckboxComponentType = {
  label?: string;
  disabled?: boolean;
  callback: Function;
  elements: { value: any; name: string }[];
  value: any;
  width: number;
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
