import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { loggedApi } from "../../axios";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { MatchLocation } from "titan_core";

interface MatchRow {
  id: string;
  opponent: string;
  date: string;
  status: string;
  location: string;
  scoreHome: number | null;
  scoreAway: number | null;
  team?: { name: string };
}

interface TeamOption {
  id: string;
  name: string;
}

interface SeasonItem {
  id: string;
  label: string;
  isCurrent: boolean;
}

export const Matches: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [matches, setMatches] = useState<MatchRow[]>([]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [teamsList, setTeamsList] = useState<TeamOption[]>([]);
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [teamId, setTeamId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState<MatchLocation>(MatchLocation.HOME);
  const [isFriendly, setIsFriendly] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchMatches = () => {
    if (clubId) {
      loggedApi.get(`/titan/clubs/${clubId}/matches`).then((res) => {
        setMatches(res.data.data);
      });
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [clubId]);

  const handleOpen = () => {
    Promise.all([
      loggedApi.get(`/titan/clubs/${clubId}/teams`),
      loggedApi.get(`/titan/clubs/${clubId}/seasons`),
    ]).then(([teamsRes, seasonsRes]) => {
      setTeamsList(teamsRes.data.data);
      const s = seasonsRes.data.data;
      setSeasons(s);
      const current = s.find((x: SeasonItem) => x.isCurrent);
      if (current) setSeasonId(current.id);
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTeamId("");
    setSeasonId("");
    setOpponent("");
    setDate("");
    setLocation(MatchLocation.HOME);
    setIsFriendly(false);
  };

  const handleCreate = async () => {
    if (!teamId || !seasonId || !opponent.trim() || !date) return;
    setCreating(true);
    try {
      await loggedApi.post(`/titan/clubs/${clubId}/matches`, {
        teamId,
        seasonId,
        opponent: opponent.trim(),
        date,
        location,
        isFriendly: isFriendly || undefined,
      });
      handleClose();
      fetchMatches();
    } finally {
      setCreating(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const locationLabel: Record<string, string> = {
    home: "Domicile",
    away: "Extérieur",
    neutral: "Neutre",
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Matchs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Planifier un match
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Équipe</TableCell>
              <TableCell>Adversaire</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  {dayjs(m.date).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                <TableCell>{m.team?.name ?? "—"}</TableCell>
                <TableCell>{m.opponent}</TableCell>
                <TableCell>{locationLabel[m.location] ?? m.location}</TableCell>
                <TableCell>
                  {m.scoreHome !== null && m.scoreAway !== null
                    ? `${m.scoreHome} - ${m.scoreAway}`
                    : "—"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={m.status}
                    size="small"
                    color={statusColor(m.status) as any}
                  />
                </TableCell>
              </TableRow>
            ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun match planifié
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Planifier un match</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Équipe"
            fullWidth
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          >
            {teamsList.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>
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
            margin="dense"
            label="Adversaire"
            fullWidth
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Date et heure"
            type="datetime-local"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            margin="dense"
            label="Lieu"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value as MatchLocation)}
          >
            <MenuItem value={MatchLocation.HOME}>Domicile</MenuItem>
            <MenuItem value={MatchLocation.AWAY}>Extérieur</MenuItem>
            <MenuItem value={MatchLocation.NEUTRAL}>Neutre</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={isFriendly}
                onChange={(e) => setIsFriendly(e.target.checked)}
              />
            }
            label="Match amical"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              creating || !teamId || !seasonId || !opponent.trim() || !date
            }
          >
            Planifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
