import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import { loggedApi } from "../../../axios";

export const SettingsSportConfig: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (!clubId) return;
    loggedApi.get(`/titan/clubs/${clubId}/sport-config`).then((res) => {
      setConfig(res.data.data ?? res.data);
    });
  }, [clubId]);

  if (!config) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configuration sportive
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Sport : {config.sport ?? "–"}
        </Typography>
        <Divider sx={{ my: 1 }} />

        {config.positions && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Postes
            </Typography>
            <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
              {config.positions.map((pos: string) => (
                <Chip key={pos} label={pos} size="small" />
              ))}
            </Box>
          </>
        )}

        {config.eventTypes && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Types d'événements
            </Typography>
            <List dense>
              {config.eventTypes.map((e: any) =>
                typeof e === "string" ? (
                  <ListItem key={e}>
                    <ListItemText primary={e} />
                  </ListItem>
                ) : (
                  <ListItem key={e.key ?? e.label}>
                    <ListItemText
                      primary={e.label ?? e.key}
                      secondary={e.description}
                    />
                  </ListItem>
                ),
              )}
            </List>
          </>
        )}

        {config.sanctionTypes && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Types de sanctions
            </Typography>
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {config.sanctionTypes.map((s: string) => (
                <Chip key={s} label={s} size="small" color="warning" />
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};
