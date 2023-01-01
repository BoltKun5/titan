import { CardModalType } from "../../local-core/context";
import React from "react";

export default React.createContext<CardModalType>({
  localCardPossession: [],
  setLocalCardPossession: () => {},
});
