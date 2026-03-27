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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { loggedApi } from "../../../axios";

interface VenueItem {
  id: string;
  name: string;
  address: string;
  capacity: number | null;
}

export const SettingsVenues: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");

  const fetchVenues = () => {
    if (!clubId) return;
    loggedApi.get(`/titan/clubs/${clubId}/venues`).then((res) => {
      setVenues(res.data.data ?? res.data);
    });
  };

  useEffect(fetchVenues, [clubId]);

  const handleCreate = async () => {
    await loggedApi.post(`/titan/clubs/${clubId}/venues`, {
      name,
      address,
      capacity: capacity ? parseInt(capacity) : null,
    });
    setOpen(false);
    setName("");
    setAddress("");
    setCapacity("");
    fetchVenues();
  };

  const handleDelete = async (venueId: string) => {
    await loggedApi.delete(`/titan/clubs/${clubId}/venues/${venueId}`);
    fetchVenues();
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Terrains / Salles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Nouveau lieu
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Capacité</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.name}</TableCell>
                <TableCell>{v.address}</TableCell>
                <TableCell>{v.capacity ?? "–"}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(v.id)}>
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
        <DialogTitle>Nouveau lieu</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
            />
            <TextField
              label="Capacité"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!name}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
