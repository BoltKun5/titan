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
} from "@mui/material";
import { loggedApi } from "../../axios";
import { TitanContext } from "../../App";
import AddIcon from "@mui/icons-material/Add";

interface ClubItem {
  id: string;
  name: string;
  sport: string;
}

export const Dashboard: React.FC = () => {
  const { user, setCurrentClubId } = useContext(TitanContext);
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loggedApi.get("/titan/clubs").then((res) => setClubs(res.data.data));
  }, []);

  const handleSelectClub = (clubId: string) => {
    setCurrentClubId(clubId);
    navigate(`/club/${clubId}/members`);
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
          <Button variant="contained" startIcon={<AddIcon />}>
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
    </Box>
  );
};
