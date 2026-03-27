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
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { loggedApi } from "../../axios";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { ClubMemberRole } from "titan_core";

interface MemberRow {
  id: string;
  role: string;
  status: string;
  position: string | null;
  jerseyNumber: number | null;
  user?: { shownName: string; firstName: string; lastName: string };
}

interface SeasonItem {
  id: string;
  label: string;
  isCurrent: boolean;
}

interface UserResult {
  id: string;
  firstName: string;
  lastName: string;
  shownName: string;
  mail: string;
}

export const Members: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [members, setMembers] = useState<MemberRow[]>([]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [seasonId, setSeasonId] = useState("");
  const [role, setRole] = useState<ClubMemberRole>(ClubMemberRole.PLAYER);
  const [position, setPosition] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchMembers = () => {
    if (clubId) {
      loggedApi
        .get(`/titan/clubs/${clubId}/members`)
        .then((res) => setMembers(res.data.data));
    }
  };

  useEffect(() => {
    fetchMembers();
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
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setSeasonId("");
    setRole(ClubMemberRole.PLAYER);
    setPosition("");
    setJerseyNumber("");
  };

  const handleSearch = () => {
    if (searchQuery.trim().length < 1) return;
    loggedApi
      .get(`/user/search?q=${encodeURIComponent(searchQuery.trim())}`)
      .then((res) => setSearchResults(res.data.users));
  };

  const handleCreate = async () => {
    if (!selectedUser || !seasonId) return;
    setCreating(true);
    try {
      await loggedApi.post(`/titan/clubs/${clubId}/members`, {
        userId: selectedUser.id,
        seasonId,
        role,
        position: position || undefined,
        jerseyNumber: jerseyNumber ? parseInt(jerseyNumber, 10) : undefined,
      });
      handleClose();
      fetchMembers();
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Effectif</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Ajouter un membre
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Poste</TableCell>
              <TableCell>N°</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  {m.user ? `${m.user.firstName} ${m.user.lastName}` : "—"}
                </TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell>{m.position || "—"}</TableCell>
                <TableCell>{m.jerseyNumber ?? "—"}</TableCell>
                <TableCell>
                  <Chip
                    label={m.status}
                    size="small"
                    color={m.status === "active" ? "success" : "default"}
                  />
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun membre inscrit
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un membre</DialogTitle>
        <DialogContent>
          {/* User search */}
          <Box display="flex" gap={1} mt={1} mb={1}>
            <TextField
              label="Rechercher un utilisateur"
              placeholder="Nom ou prénom"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              variant="outlined"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Chercher
            </Button>
          </Box>
          {searchResults.length > 0 && !selectedUser && (
            <Paper
              variant="outlined"
              sx={{ maxHeight: 150, overflow: "auto", mb: 2 }}
            >
              <List dense>
                {searchResults.map((u) => (
                  <ListItem key={u.id} disablePadding>
                    <ListItemButton onClick={() => setSelectedUser(u)}>
                      <ListItemText
                        primary={`${u.firstName} ${u.lastName}`}
                        secondary={u.mail}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          {selectedUser && (
            <Chip
              label={`${selectedUser.firstName} ${selectedUser.lastName}`}
              onDelete={() => setSelectedUser(null)}
              sx={{ mb: 2 }}
            />
          )}

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
            label="Rôle"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value as ClubMemberRole)}
          >
            {Object.values(ClubMemberRole).map((r) => (
              <MenuItem key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Poste (optionnel)"
            fullWidth
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Numéro de maillot (optionnel)"
            fullWidth
            type="number"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !selectedUser || !seasonId}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
