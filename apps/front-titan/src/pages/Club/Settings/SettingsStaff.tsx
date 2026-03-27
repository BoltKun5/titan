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
  MenuItem,
  IconButton,
  Alert,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { loggedApi } from "../../../axios";
import { TitanRole } from "titan_core";

interface StaffItem {
  id: string;
  role: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    shownName: string;
    mail: string;
  };
}

interface UserResult {
  id: string;
  firstName: string;
  lastName: string;
  shownName: string;
  mail: string;
}

const ROLE_OPTIONS = [
  { value: TitanRole.ADMIN, label: "Admin" },
  { value: TitanRole.MANAGER, label: "Dirigeant" },
  { value: TitanRole.COACH, label: "Entraîneur" },
  { value: TitanRole.PLAYER, label: "Joueur" },
  { value: TitanRole.VIEWER, label: "Spectateur" },
];

export const SettingsStaff: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);

  // Assign dialog
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>(TitanRole.COACH);

  // Invite dialog
  const [inviteRole, setInviteRole] = useState<string>(TitanRole.COACH);
  const [inviteLink, setInviteLink] = useState("");

  const fetchStaff = () => {
    if (!clubId) return;
    loggedApi.get(`/titan/clubs/${clubId}/staff`).then((res) => {
      setStaff(res.data.data ?? res.data);
    });
  };

  useEffect(fetchStaff, [clubId]);

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    const res = await loggedApi.get(
      `/user/search?q=${encodeURIComponent(searchQuery)}`,
    );
    setSearchResults(res.data.data ?? res.data ?? []);
  };

  const handleAssign = async () => {
    await loggedApi.post(`/titan/clubs/${clubId}/staff`, {
      userId: selectedUserId,
      role: selectedRole,
    });
    setOpenAssign(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUserId("");
    fetchStaff();
  };

  const handleRemove = async (staffRoleId: string) => {
    await loggedApi.delete(`/titan/clubs/${clubId}/staff/${staffRoleId}`);
    fetchStaff();
  };

  const handleGenerateInvite = async () => {
    const res = await loggedApi.post(`/titan/clubs/${clubId}/invitations`, {
      role: inviteRole,
    });
    const code = res.data.data?.code ?? res.data.code;
    setInviteLink(`${window.location.origin}/invite/${code}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Staff & Rôles</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<LinkIcon />}
            onClick={() => setOpenInvite(true)}
          >
            Générer un lien
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAssign(true)}
          >
            Assigner un rôle
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  {s.user ? `${s.user.firstName} ${s.user.lastName}` : "–"}
                </TableCell>
                <TableCell>{s.user?.mail ?? "–"}</TableCell>
                <TableCell>
                  {ROLE_OPTIONS.find((r) => r.value === s.role)?.label ??
                    s.role}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleRemove(s.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign role dialog */}
      <Dialog
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assigner un rôle</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Box display="flex" gap={1}>
              <TextField
                label="Rechercher un utilisateur"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                fullWidth
              />
              <Button onClick={handleSearch} variant="outlined">
                Chercher
              </Button>
            </Box>
            {searchResults.length > 0 && (
              <TextField
                select
                label="Utilisateur"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                fullWidth
              >
                {searchResults.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.mail})
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              select
              label="Rôle"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              fullWidth
            >
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssign(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedUserId}
          >
            Assigner
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate invite dialog */}
      <Dialog
        open={openInvite}
        onClose={() => {
          setOpenInvite(false);
          setInviteLink("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Générer un lien d'invitation</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              select
              label="Rôle"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              fullWidth
            >
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
            {!inviteLink && (
              <Button variant="contained" onClick={handleGenerateInvite}>
                Générer
              </Button>
            )}
            {inviteLink && (
              <>
                <Alert severity="success">Lien généré (valide 7 jours)</Alert>
                <TextField
                  value={inviteLink}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={copyToClipboard}>
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenInvite(false);
              setInviteLink("");
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
