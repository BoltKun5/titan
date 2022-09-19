import React from "react";
import { LoginContextType } from "../../../../local-core";

export default React.createContext<LoginContextType>({
  currentUser: {
    id: "",
    shownName: "",
    role: 0
  },
  setCurrentUser: () => {
  },
  token: "",
  setToken: () => {
  },
})
