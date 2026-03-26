import React, { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import { loggedApi } from "../../axios";
import AddIcon from "@mui/icons-material/Add";

interface MemberRow {
  id: string;
  role: string;
  status: string;
  position: string | null;
  jerseyNumber: number | null;
  user?: { shownName: string; firstName: string; lastName: string };
}

export const Members: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [members, setMembers] = useState<MemberRow[]>([]);

  useEffect(() => {
    if (clubId) {
      loggedApi.get(`/titan/clubs/${clubId}/members`).then((res) => {
        setMembers(res.data.data);
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
        <Typography variant="h5">Effectif</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
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
                    color={m.status === "ACTIVE" ? "success" : "default"}
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
    </Box>
  );
};
