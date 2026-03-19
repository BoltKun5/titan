import { StoreType } from "../../local-core/context";
import React from "react";

export default React.createContext<StoreType>({
  user: {
    id: "",
    role: 0,
    shownName: "",
  },
  setUser: () => {},
  notifications: [],
  setNotifications: () => {},
});
