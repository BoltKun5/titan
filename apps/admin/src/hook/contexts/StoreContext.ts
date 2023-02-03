import { StoreType } from "../../local-core/context";
import React from "react";

export default React.createContext<StoreType>({
  user: null,
  setUser: () => {},
});
