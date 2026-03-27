import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { loggedApi } from "../../axios";

export const AcceptInvite: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    loggedApi
      .post(`/titan/invitations/${code}/accept`)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setClubId(data.clubId ?? null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ?? "Lien d'invitation invalide ou expiré",
        );
      })
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box textAlign="center" maxWidth={400}>
        {error ? (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={() => navigate("/dashboard")}>
              Retour au tableau de bord
            </Button>
          </>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Invitation acceptée avec succès !
            </Alert>
            <Button
              variant="contained"
              onClick={() =>
                navigate(clubId ? `/club/${clubId}` : "/dashboard")
              }
            >
              Accéder au club
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
