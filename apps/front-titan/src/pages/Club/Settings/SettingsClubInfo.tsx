import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { loggedApi } from "../../../axios";

export const SettingsClubInfo: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!clubId) return;
    loggedApi.get(`/titan/clubs/${clubId}`).then((res) => {
      const club = res.data.data;
      setName(club.name ?? "");
      setAddress(club.address ?? "");
      setContactEmail(club.contactEmail ?? "");
      setContactPhone(club.contactPhone ?? "");
    });
  }, [clubId]);

  const handleSave = async () => {
    await loggedApi.put(`/titan/clubs/${clubId}`, {
      name,
      address,
      contactEmail,
      contactPhone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informations du club
      </Typography>
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Modifications enregistrées
        </Alert>
      )}
      <Box display="flex" flexDirection="column" gap={2} maxWidth={500}>
        <TextField
          label="Nom du club"
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
          label="Email de contact"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Téléphone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ alignSelf: "flex-start" }}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};
