import { CardModalType } from "../../local-core";
import React from "react";

export default React.createContext<CardModalType>({
  localCardPossession: [],
  setLocalCardPossession: () => {},
});
