import React from "react";
import { Grid, Box } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import BadgeIcon from "@mui/icons-material/Badge";
import PaymentIcon from "@mui/icons-material/Payment";
import WarningIcon from "@mui/icons-material/Warning";
import {
  StatCard,
  UpcomingMatchesList,
  RecentResultsList,
  AlertsList,
} from "../../../components/Dashboard";
import { IDashboardManagerResponse } from "titan_core";

interface Props {
  data: IDashboardManagerResponse;
}

export const DashboardDirigeant: React.FC<Props> = ({ data }) => {
  return (
    <Box>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Membres actifs"
            value={data.totalMembers}
            icon={<GroupIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Licences valides"
            value={data.activeLicenses}
            icon={<BadgeIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Cotisations payées"
            value={`${data.subscriptionRate}%`}
            icon={<PaymentIcon />}
            color={data.subscriptionRate >= 80 ? "#2e7d32" : "#ed6c02"}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            label="Alertes"
            value={data.alerts.length}
            icon={<WarningIcon />}
            color={data.alerts.length > 0 ? "#d32f2f" : "#2e7d32"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <UpcomingMatchesList matches={data.upcomingMatches} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentResultsList results={data.recentResults} />
        </Grid>
        <Grid item xs={12}>
          <AlertsList alerts={data.alerts} />
        </Grid>
      </Grid>
    </Box>
  );
};
