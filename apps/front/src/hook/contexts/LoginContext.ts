import React from "react";

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
