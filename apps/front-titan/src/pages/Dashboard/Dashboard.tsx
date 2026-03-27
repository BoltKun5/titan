import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { loggedApi } from "../../axios";
import { TitanContext } from "../../App";
import AddIcon from "@mui/icons-material/Add";
import { SportType } from "titan_core";

interface ClubItem {
  id: string;
  name: string;
  sport: string;
}

export const Dashboard: React.FC = () => {
  const { user, setCurrentClubId } = useContext(TitanContext);
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubSport, setClubSport] = useState<SportType>(SportType.HANDBALL);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const fetchClubs = () => {
    loggedApi.get("/titan/clubs").then((res) => setClubs(res.data.data));
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleSelectClub = (clubId: string) => {
    setCurrentClubId(clubId);
    navigate(`/club/${clubId}/members`);
  };

  const handleCreateClub = async () => {
    if (!clubName.trim()) return;
    setCreating(true);
    try {
      const res = await loggedApi.post("/titan/clubs", {
        name: clubName.trim(),
        sport: clubSport,
      });
      setOpenCreate(false);
      setClubName("");
      setClubSport(SportType.HANDBALL);
      fetchClubs();
      handleSelectClub(res.data.data.id);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Titan — {user.shownName}
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Mes Clubs</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Créer un club
          </Button>
        </Box>

        <Grid container spacing={2}>
          {clubs.map((club) => (
            <Grid item xs={12} sm={6} md={4} key={club.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{club.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {club.sport}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleSelectClub(club.id)}
                  >
                    Ouvrir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {clubs.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center">
                Aucun club. Créez votre premier club pour commencer.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Créer un club</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du club"
            fullWidth
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Sport"
            fullWidth
            value={clubSport}
            onChange={(e) => setClubSport(e.target.value as SportType)}
          >
            {Object.values(SportType).map((s) => (
              <MenuItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleCreateClub}
            disabled={creating || !clubName.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
