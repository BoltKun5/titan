import { AlertColor } from "@mui/material";

export interface INotificationElement {
  severity: AlertColor;
  message: string;
}

export interface CardSetFilterInterface {
  name: string;
  id: string;
  category: string;
  status: boolean;
  categoryCode: string;
  title?: string;
  code?: string;
}
