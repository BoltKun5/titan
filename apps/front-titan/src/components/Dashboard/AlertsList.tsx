import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BadgeIcon from "@mui/icons-material/Badge";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonOffIcon from "@mui/icons-material/PersonOff";

interface Alert {
  type:
    | "missing_certificate"
    | "expired_license"
    | "unpaid_fee"
    | "repeated_absence";
  message: string;
  memberId: string;
  memberName: string;
}

interface Props {
  alerts: Alert[];
  title?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  missing_certificate: <LocalHospitalIcon color="error" />,
  expired_license: <BadgeIcon color="warning" />,
  unpaid_fee: <PaymentIcon color="error" />,
  repeated_absence: <PersonOffIcon color="warning" />,
};

export const AlertsList: React.FC<Props> = ({ alerts, title = "Alertes" }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {alerts.length === 0 ? (
        <Typography color="text.secondary">Aucune alerte</Typography>
      ) : (
        <List dense>
          {alerts.map((a, idx) => (
            <ListItem key={idx}>
              <ListItemIcon>{ICON_MAP[a.type]}</ListItemIcon>
              <ListItemText primary={a.memberName} secondary={a.message} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};
