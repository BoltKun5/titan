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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { loggedApi } from "../../axios";
import AddIcon from "@mui/icons-material/Add";
import { GenderSection } from "titan_core";

interface TeamItem {
  id: string;
  name: string;
  category: string | null;
  genderSection: string;
  teamPlayers?: { id: string }[];
}

interface SeasonItem {
  id: string;
  label: string;
  isCurrent: boolean;
}

export const Teams: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [teams, setTeams] = useState<TeamItem[]>([]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [name, setName] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [genderSection, setGenderSection] = useState<GenderSection>(
    GenderSection.MALE,
  );
  const [category, setCategory] = useState("");
  const [division, setDivision] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchTeams = () => {
    if (clubId) {
      loggedApi.get(`/titan/clubs/${clubId}/teams`).then((res) => {
        setTeams(res.data.data);
      });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [clubId]);

  const handleOpen = () => {
    loggedApi.get(`/titan/clubs/${clubId}/seasons`).then((res) => {
      const s = res.data.data;
      setSeasons(s);
      const current = s.find((x: SeasonItem) => x.isCurrent);
      if (current) setSeasonId(current.id);
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setSeasonId("");
    setGenderSection(GenderSection.MALE);
    setCategory("");
    setDivision("");
  };

  const handleCreate = async () => {
    if (!name.trim() || !seasonId) return;
    setCreating(true);
    try {
      await loggedApi.post(`/titan/clubs/${clubId}/teams`, {
        name: name.trim(),
        seasonId,
        genderSection,
        category: category || undefined,
        division: division || undefined,
      });
      handleClose();
      fetchTeams();
    } finally {
      setCreating(false);
    }
  };

  const genderLabel: Record<string, string> = {
    male: "Masculin",
    female: "Féminin",
    mixed: "Mixte",
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Équipes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
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
                    label={
                      genderLabel[team.genderSection] ?? team.genderSection
                    }
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Créer une équipe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de l'équipe"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Saison"
            fullWidth
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
          >
            {seasons.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Section"
            fullWidth
            value={genderSection}
            onChange={(e) => setGenderSection(e.target.value as GenderSection)}
          >
            <MenuItem value={GenderSection.MALE}>Masculin</MenuItem>
            <MenuItem value={GenderSection.FEMALE}>Féminin</MenuItem>
            <MenuItem value={GenderSection.MIXED}>Mixte</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Catégorie (optionnel)"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Division (optionnel)"
            fullWidth
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !name.trim() || !seasonId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
