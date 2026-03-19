import React from "react";
import { IUser } from "titan_core";
import { INotificationElement } from "./interface";

export type StoreType = {
  user: Partial<IUser>;
  setUser: React.Dispatch<React.SetStateAction<Partial<IUser>>>;
  notifications: INotificationElement[];
  setNotifications: React.Dispatch<
    React.SetStateAction<INotificationElement[]>
  >;
};
