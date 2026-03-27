import React from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PercentIcon from "@mui/icons-material/Percent";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  StatCard,
  UpcomingMatchesList,
  RecentResultsList,
} from "../../../components/Dashboard";
import { IDashboardCoachResponse } from "titan_core";

interface Props {
  data: IDashboardCoachResponse;
}

export const DashboardEntraineur: React.FC<Props> = ({ data }) => {
  const totalPlayers = data.teams.reduce((sum, t) => sum + t.playerCount, 0);

  return (
    <Box>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Joueurs total"
            value={totalPlayers}
            icon={<GroupIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Taux de présence"
            value={`${data.trainingAttendanceRate}%`}
            icon={<PercentIcon />}
            color={data.trainingAttendanceRate >= 75 ? "#2e7d32" : "#ed6c02"}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Meilleur buteur"
            value={
              data.topScorer
                ? `${data.topScorer.playerName} (${data.topScorer.goals})`
                : "–"
            }
            icon={<EmojiEventsIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mes équipes
            </Typography>
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {data.teams.map((t) => (
                <Chip
                  key={t.id}
                  label={`${t.name} (${t.playerCount})`}
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Upcoming trainings */}
      <Paper sx={{ p: 2, mb: 2 }}>
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <UpcomingMatchesList matches={data.upcomingMatches} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentResultsList results={data.recentResults} />
        </Grid>
      </Grid>
    </Box>
  );
};
