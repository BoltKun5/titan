import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { TitanRole } from "titan_core";

const BASE_TABS = [
  { label: "Tableau de bord", path: "dashboard" },
  { label: "Effectif", path: "members" },
  { label: "Équipes", path: "teams" },
  { label: "Matchs", path: "matches" },
  { label: "Entraînements", path: "trainings" },
];

const SETTINGS_TAB = { label: "Paramètres", path: "settings" };

export const ClubLayout: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { setCurrentClubId, setClubRole, clubRole } = useContext(TitanContext);
  const [clubName, setClubName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin =
    clubRole === TitanRole.ADMIN || clubRole === TitanRole.MANAGER;

  const TABS = useMemo(
    () => (isAdmin ? [...BASE_TABS, SETTINGS_TAB] : BASE_TABS),
    [isAdmin],
  );

  const currentTab = TABS.findIndex((t) => location.pathname.includes(t.path));

  useEffect(() => {
    if (clubId) {
      setCurrentClubId(clubId);
      loggedApi.get(`/titan/clubs/${clubId}`).then((res) => {
        setClubName(res.data.data.name);
      });
      loggedApi
        .get(`/titan/clubs/${clubId}/my-role`)
        .then((res) => {
          setClubRole(res.data.role ?? null);
        })
        .catch(() => setClubRole(null));
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
          variant="scrollable"
          scrollButtons="auto"
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
