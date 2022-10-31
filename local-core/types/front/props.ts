import { ICardSerie, ICard } from "../../../local-core"

export type SideBarComponentPropsType = {
  series: ICardSerie[]
}

export type SwitchInputComponentPropsType = {
  value: boolean,
  isDisabled: boolean,
  modifyValue: Function,
  label: string,
  id: string
}

export type SingleCardComponentPropsType = {
  card: ICard,
  index: number,
  firstType: 'classic' | 'reverse',
}

export type SingleCardOverlayComponentPropsType = {
  card: ICard,
  index: number,
  firstType: 'classic' | 'reverse'
}

export type CardCounterComponentPropsType = {
  card: ICard,
  label: string,
  type: 'classic' | 'reverse',
  canBeReverse: boolean
}

export type SingleCardOverlayContentComponentPropsType = {
  card: ICard,
  index: number,
  firstType: 'classic' | 'reverse'
}

export type StatCardComponentType = {
  data: {
    icon?: string,
    ownedQuantity: number,
    distinctQuantity: number,
    possibleQuantity: number,
    label: string
  }
}

export type TextInputComponentType = {
  value?: string,
  modifyValue?: Function,
  label?: string,
  id?: string,
  type?: string,
  onKeyUpCallback?: any,
  onKeyDownCallback?: any
}

export type ButtonComponentPropsType = {
  label: string,
  type?: "button" | "submit" | "reset" | undefined,
  size?: number,
  disabled?: boolean
}

export type SwipeCheckboxComponentType = {
  label?: string,
  disabled?: boolean,
  callback: Function,
  elements: { value: any, name: string }[],
  value: any,
  width: number
}