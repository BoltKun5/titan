import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { loggedApi } from "../../../axios";
import { TitanRole } from "titan_core";
import { DashboardDirigeant } from "./DashboardDirigeant";
import { DashboardEntraineur } from "./DashboardEntraineur";
import { DashboardJoueur } from "./DashboardJoueur";

interface SeasonItem {
  id: string;
  label: string;
  isCurrent: boolean;
}

export const ClubDashboard: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [seasonId, setSeasonId] = useState<string>("");

  // Load seasons
  useEffect(() => {
    if (!clubId) return;
    loggedApi.get(`/titan/clubs/${clubId}/seasons`).then((res) => {
      const s = res.data.data ?? res.data;
      setSeasons(s);
      const current = s.find((x: SeasonItem) => x.isCurrent);
      if (current) setSeasonId(current.id);
      else if (s.length > 0) setSeasonId(s[0].id);
    });
  }, [clubId]);

  // Fetch dashboard when season selected
  useEffect(() => {
    if (!clubId || !seasonId) return;
    setLoading(true);
    loggedApi
      .get(`/titan/clubs/${clubId}/dashboard?seasonId=${seasonId}`)
      .then((res) => {
        const body = res.data;
        setRole(body.role);
        setData(body.data);
      })
      .finally(() => setLoading(false));
  }, [clubId, seasonId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Tableau de bord</Typography>
        {seasons.length > 1 && (
          <TextField
            select
            size="small"
            label="Saison"
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {seasons.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {role === TitanRole.ADMIN || role === TitanRole.MANAGER ? (
        <DashboardDirigeant data={data} />
      ) : role === TitanRole.COACH ? (
        <DashboardEntraineur data={data} />
      ) : (
        <DashboardJoueur data={data} />
      )}
    </Box>
  );
};
