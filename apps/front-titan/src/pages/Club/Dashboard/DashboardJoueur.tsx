import React from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AssistWalkerIcon from "@mui/icons-material/AssistWalker";
import TimerIcon from "@mui/icons-material/Timer";
import SportsIcon from "@mui/icons-material/Sports";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BadgeIcon from "@mui/icons-material/Badge";
import PaymentIcon from "@mui/icons-material/Payment";
import { StatCard, UpcomingMatchesList } from "../../../components/Dashboard";
import { IDashboardPlayerResponse } from "titan_core";

interface Props {
  data: IDashboardPlayerResponse;
}

const DOC_ICONS: Record<string, React.ReactNode> = {
  medical: <LocalHospitalIcon color="error" />,
  license: <BadgeIcon color="warning" />,
  payment: <PaymentIcon color="error" />,
};

export const DashboardJoueur: React.FC<Props> = ({ data }) => {
  const stats = data.personalStats;

  return (
    <Box>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Buts"
            value={stats.goals}
            icon={<SportsSoccerIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Passes décisives"
            value={stats.assists}
            icon={<AssistWalkerIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Matchs joués"
            value={stats.matchesPlayed}
            icon={<SportsIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Minutes jouées"
            value={stats.minutesPlayed}
            icon={<TimerIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <UpcomingMatchesList matches={data.upcomingMatches} />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Upcoming trainings */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Prochains entraînements
            </Typography>
            {data.upcomingTrainings.length === 0 ? (
              <Typography color="text.secondary">
                Aucun entraînement à venir
              </Typography>
            ) : (
              <List dense>
                {data.upcomingTrainings.map((t) => (
                  <ListItem key={t.id}>
                    <ListItemText
                      primary={`${t.teamName} — ${t.startTime} à ${t.endTime}`}
                      secondary={new Date(t.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Pending documents */}
      {data.pendingDocuments.length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Documents à fournir
          </Typography>
          <List dense>
            {data.pendingDocuments.map((d, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>{DOC_ICONS[d.type]}</ListItemIcon>
                <ListItemText primary={d.message} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
