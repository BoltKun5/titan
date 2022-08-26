import {CardSerie, Card} from "../../../api/src/database";

export type SideBarComponentPropsType = {
  series: CardSerie[]
}

export type SwitchInputComponentPropsType = {
  value: boolean,
  isDisabled: boolean,
  modifyValue: Function,
  label: string,
  id: string
}

export type SingleCardComponentPropsType = {
  card: Card,
  index: number,
  firstType: 'classic' | 'reverse'
}

export type SingleCardOverlayComponentPropsType = {
  card: Card,
  index: number,
  firstType: 'classic' | 'reverse'
}

export type CardCounterComponentPropsType = {
  card: Card,
  label: string,
  type: 'classic' | 'reverse'
}

export type SingleCardOverlayContentComponentPropsType = {
  card: Card,
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
