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
} from "@mui/material";
import { loggedApi } from "../../axios";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { TrainingRecurrence } from "titan_core";

interface TrainingRow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isCancelled: boolean;
  recurrence: string;
  venue?: { name: string } | null;
  team?: { name: string };
}

interface TeamOption {
  id: string;
  name: string;
}

export const Trainings: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [teamsList, setTeamsList] = useState<TeamOption[]>([]);
  const [teamId, setTeamId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [recurrence, setRecurrence] = useState<TrainingRecurrence>(
    TrainingRecurrence.ONCE,
  );
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchTrainings = () => {
    if (clubId) {
      loggedApi.get(`/titan/clubs/${clubId}/trainings`).then((res) => {
        setTrainings(res.data.data);
      });
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [clubId]);

  const handleOpen = () => {
    loggedApi.get(`/titan/clubs/${clubId}/teams`).then((res) => {
      setTeamsList(res.data.data);
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTeamId("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setRecurrence(TrainingRecurrence.ONCE);
    setNotes("");
  };

  const handleCreate = async () => {
    if (!teamId || !date || !startTime || !endTime) return;
    setCreating(true);
    try {
      await loggedApi.post(`/titan/clubs/${clubId}/trainings`, {
        teamId,
        date,
        startTime,
        endTime,
        recurrence,
        notes: notes || undefined,
      });
      handleClose();
      fetchTrainings();
    } finally {
      setCreating(false);
    }
  };

  const recurrenceLabel: Record<string, string> = {
    once: "Unique",
    weekly: "Hebdomadaire",
    biweekly: "Bimensuel",
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Entraînements</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Planifier un entraînement
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Équipe</TableCell>
              <TableCell>Horaires</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Récurrence</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainings.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{dayjs(t.date).format("DD/MM/YYYY")}</TableCell>
                <TableCell>{t.team?.name ?? "—"}</TableCell>
                <TableCell>
                  {t.startTime} – {t.endTime}
                </TableCell>
                <TableCell>{t.venue?.name ?? "—"}</TableCell>
                <TableCell>
                  {recurrenceLabel[t.recurrence] ?? t.recurrence}
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.isCancelled ? "Annulé" : "Programmé"}
                    size="small"
                    color={t.isCancelled ? "error" : "success"}
                  />
                </TableCell>
              </TableRow>
            ))}
            {trainings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun entraînement planifié
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Planifier un entraînement</DialogTitle>
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
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Box display="flex" gap={2}>
            <TextField
              margin="dense"
              label="Début"
              type="time"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Fin"
              type="time"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            select
            margin="dense"
            label="Récurrence"
            fullWidth
            value={recurrence}
            onChange={(e) =>
              setRecurrence(e.target.value as TrainingRecurrence)
            }
          >
            <MenuItem value={TrainingRecurrence.ONCE}>Unique</MenuItem>
            <MenuItem value={TrainingRecurrence.WEEKLY}>Hebdomadaire</MenuItem>
            <MenuItem value={TrainingRecurrence.BIWEEKLY}>Bimensuel</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Notes (optionnel)"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !teamId || !date || !startTime || !endTime}
          >
            Planifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
