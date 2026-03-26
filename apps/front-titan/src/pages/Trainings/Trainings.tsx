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

export const Trainings: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);

  useEffect(() => {
    if (clubId) {
      loggedApi.get(`/titan/clubs/${clubId}/trainings`).then((res) => {
        setTrainings(res.data.data);
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
        <Typography variant="h5">Entraînements</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Planifier un entraînement
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
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
                <TableCell>
                  {t.startTime} – {t.endTime}
                </TableCell>
                <TableCell>{t.venue?.name ?? "—"}</TableCell>
                <TableCell>{t.recurrence}</TableCell>
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
                <TableCell colSpan={5} align="center">
                  Aucun entraînement planifié
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
