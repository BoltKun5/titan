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
} from "@mui/material";
import { loggedApi } from "../../axios";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

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

export const Matches: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [matches, setMatches] = useState<MatchRow[]>([]);

  useEffect(() => {
    if (clubId) {
      loggedApi.get(`/titan/clubs/${clubId}/matches`).then((res) => {
        setMatches(res.data.data);
      });
    }
  }, [clubId]);

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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Matchs</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
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
                <TableCell>{m.location}</TableCell>
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
    </Box>
  );
};
