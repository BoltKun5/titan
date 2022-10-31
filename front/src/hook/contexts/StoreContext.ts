import { StoreType } from './../../front-types/context';
import React from "react";

export default React.createContext<StoreType>({
  series: []
})
