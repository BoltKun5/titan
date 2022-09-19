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
  firstType: 'classic' | 'reverse'
}

export type SingleCardOverlayComponentPropsType = {
  card: ICard,
  index: number,
  firstType: 'classic' | 'reverse'
}

export type CardCounterComponentPropsType = {
  card: ICard,
  label: string,
  type: 'classic' | 'reverse'
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
