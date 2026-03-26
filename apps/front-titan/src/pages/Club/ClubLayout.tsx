import React, { useContext, useEffect, useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { loggedApi } from "../../axios";
import { TitanContext } from "../../App";

const TABS = [
  { label: "Effectif", path: "members" },
  { label: "Équipes", path: "teams" },
  { label: "Matchs", path: "matches" },
  { label: "Entraînements", path: "trainings" },
];

export const ClubLayout: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { setCurrentClubId } = useContext(TitanContext);
  const [clubName, setClubName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = TABS.findIndex((t) => location.pathname.includes(t.path));

  useEffect(() => {
    if (clubId) {
      setCurrentClubId(clubId);
      loggedApi.get(`/titan/clubs/${clubId}`).then((res) => {
        setClubName(res.data.data.name);
      });
    }
  }, [clubId]);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            {clubName}
          </Typography>
        </Toolbar>
        <Tabs
          value={currentTab >= 0 ? currentTab : 0}
          onChange={(_, idx) => navigate(`/club/${clubId}/${TABS[idx].path}`)}
          textColor="inherit"
          indicatorColor="secondary"
          variant="fullWidth"
        >
          {TABS.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </AppBar>

      <Box p={3}>
        <Outlet />
      </Box>
    </Box>
  );
};
