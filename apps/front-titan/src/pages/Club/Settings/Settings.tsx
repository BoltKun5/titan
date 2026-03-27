import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { SettingsClubInfo } from "./SettingsClubInfo";
import { SettingsSeasons } from "./SettingsSeasons";
import { SettingsVenues } from "./SettingsVenues";
import { SettingsStaff } from "./SettingsStaff";
import { SettingsSportConfig } from "./SettingsSportConfig";

const SETTINGS_TABS = [
  { label: "Infos du club", component: SettingsClubInfo },
  { label: "Saisons", component: SettingsSeasons },
  { label: "Terrains", component: SettingsVenues },
  { label: "Staff", component: SettingsStaff },
  { label: "Config sportive", component: SettingsSportConfig },
];

export const Settings: React.FC = () => {
  const [tab, setTab] = useState(0);
  const ActivePanel = SETTINGS_TABS[tab].component;

  return (
    <Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, idx) => setTab(idx)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {SETTINGS_TABS.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>
      </Paper>
      <ActivePanel />
    </Box>
  );
};
