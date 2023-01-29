import { AlertColor } from "@mui/material";

export interface INotificationElement {
  severity: AlertColor;
  message: string;
}

export interface ICardSetFilter {
  name: string;
  id: string;
  category: string;
  status: boolean;
  categoryCode: string;
  title?: string;
  code?: string;
}

export interface ICardRarityFilter {
  rarity: string;
  value: boolean;
}
