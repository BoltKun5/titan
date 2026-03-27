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

interface RecentResult {
  id: string;
  date: string;
  opponent: string;
  teamName: string;
  scoreHome: number | null;
  scoreAway: number | null;
  location: string;
}

interface Props {
  results: RecentResult[];
  title?: string;
}

const getResultChip = (result: RecentResult) => {
  if (result.scoreHome == null || result.scoreAway == null) return null;
  const isHome = result.location === "home";
  const ourScore = isHome ? result.scoreHome : result.scoreAway;
  const theirScore = isHome ? result.scoreAway : result.scoreHome;
  if (ourScore > theirScore)
    return <Chip label="V" size="small" color="success" />;
  if (ourScore < theirScore)
    return <Chip label="D" size="small" color="error" />;
  return <Chip label="N" size="small" color="warning" />;
};

export const RecentResultsList: React.FC<Props> = ({
  results,
  title = "Derniers résultats",
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {results.length === 0 ? (
        <Typography color="text.secondary">Aucun résultat récent</Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Équipe</TableCell>
                <TableCell>Adversaire</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Résultat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {new Date(r.date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>{r.teamName}</TableCell>
                  <TableCell>{r.opponent}</TableCell>
                  <TableCell align="center">
                    {r.scoreHome != null
                      ? `${r.scoreHome} - ${r.scoreAway}`
                      : "–"}
                  </TableCell>
                  <TableCell align="center">{getResultChip(r)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
