import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

interface UpcomingMatch {
  id: string;
  date: string;
  opponent: string;
  teamName: string;
  location: string;
}

interface Props {
  matches: UpcomingMatch[];
  title?: string;
}

export const UpcomingMatchesList: React.FC<Props> = ({
  matches,
  title = "Prochains matchs",
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {matches.length === 0 ? (
        <Typography color="text.secondary">Aucun match à venir</Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Équipe</TableCell>
                <TableCell>Adversaire</TableCell>
                <TableCell>Lieu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    {new Date(m.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{m.teamName}</TableCell>
                  <TableCell>{m.opponent}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        m.location === "home"
                          ? "Domicile"
                          : m.location === "away"
                          ? "Extérieur"
                          : "Neutre"
                      }
                      size="small"
                      color={m.location === "home" ? "primary" : "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
