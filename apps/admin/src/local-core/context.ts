import React from "react";
import { IUser } from "vokit_core";

export type StoreType = {
  user: Partial<IUser> | null;
  setUser: React.Dispatch<React.SetStateAction<Partial<IUser> | null>>;
};
