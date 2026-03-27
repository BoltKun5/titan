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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { loggedApi } from "../../../axios";

interface SeasonItem {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export const SettingsSeasons: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const fetchSeasons = () => {
    if (!clubId) return;
    loggedApi.get(`/titan/clubs/${clubId}/seasons`).then((res) => {
      setSeasons(res.data.data ?? res.data);
    });
  };

  useEffect(fetchSeasons, [clubId]);

  const handleCreate = async () => {
    await loggedApi.post(`/titan/clubs/${clubId}/seasons`, {
      label,
      startDate,
      endDate,
      isCurrent,
    });
    setOpen(false);
    setLabel("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    fetchSeasons();
  };

  const handleDelete = async (seasonId: string) => {
    await loggedApi.delete(`/titan/clubs/${clubId}/seasons/${seasonId}`);
    fetchSeasons();
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Saisons</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Nouvelle saison
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Début</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seasons.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.label}</TableCell>
                <TableCell>{s.startDate}</TableCell>
                <TableCell>{s.endDate}</TableCell>
                <TableCell>
                  {s.isCurrent && (
                    <Chip label="En cours" color="primary" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(s.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nouvelle saison</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              fullWidth
            />
            <TextField
              label="Date de début"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Date de fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!label || !startDate || !endDate}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
