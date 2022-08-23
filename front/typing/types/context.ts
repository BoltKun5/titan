import {Card} from "../../../api/src/database";
import {CardSetFilterInterface} from "../../../api/src/local_core/types/types/interface/front";

export type CardManagerContextType = {
  cardSetFilter: CardSetFilterInterface[],
  setCardSetFilter: React.Dispatch<React.SetStateAction<CardSetFilterInterface[]>>,
  nameFilter: string,
  setNameFilter: React.Dispatch<React.SetStateAction<string>>,
  order: string,
  setOrder: React.Dispatch<React.SetStateAction<string>>,
  collectionMode: boolean,
  setCollectionMode: React.Dispatch<React.SetStateAction<boolean>>,
  separateReverse: boolean,
  setSeparateReverse: React.Dispatch<React.SetStateAction<boolean>>,
  showUnowned: boolean,
  setShowUnowned: React.Dispatch<React.SetStateAction<boolean>>,
  cards: Card[],
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  resetAllFilters: () => void,
  massInput: boolean,
  setMassInput: React.Dispatch<React.SetStateAction<boolean>>,
  rarityFilter: any[],
  setRarityFilter: React.Dispatch<React.SetStateAction<any[]>>
}
