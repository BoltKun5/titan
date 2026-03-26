import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import { loggedApi } from "../../axios";
import AddIcon from "@mui/icons-material/Add";

interface TeamItem {
  id: string;
  name: string;
  category: string | null;
  genderSection: string;
  teamPlayers?: { id: string }[];
}

export const Teams: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [teams, setTeams] = useState<TeamItem[]>([]);

  useEffect(() => {
    if (clubId) {
      loggedApi.get(`/titan/clubs/${clubId}/teams`).then((res) => {
        setTeams(res.data.data);
      });
    }
  }, [clubId]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Équipes</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Créer une équipe
        </Button>
      </Box>

      <Grid container spacing={2}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Box display="flex" gap={1} mt={1}>
                  {team.category && <Chip label={team.category} size="small" />}
                  <Chip
                    label={team.genderSection}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {team.teamPlayers?.length ?? 0} joueur(s)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {teams.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" textAlign="center">
              Aucune équipe créée
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
