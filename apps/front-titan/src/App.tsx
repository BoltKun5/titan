import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { loggedApi } from "./axios";
import { IUser, TitanRole } from "titan_core";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { ClubLayout } from "./pages/Club/ClubLayout";
import { ClubDashboard } from "./pages/Club/Dashboard/ClubDashboard";
import { Members } from "./pages/Members/Members";
import { Teams } from "./pages/Teams/Teams";
import { Matches } from "./pages/Matches/Matches";
import { Trainings } from "./pages/Trainings/Trainings";
import { Settings } from "./pages/Club/Settings/Settings";
import { AcceptInvite } from "./pages/Invite/AcceptInvite";
import { CircularProgress, Box } from "@mui/material";

export interface ITitanContext {
  user: Partial<IUser>;
  setUser: React.Dispatch<React.SetStateAction<Partial<IUser>>>;
  currentClubId: string | null;
  setCurrentClubId: React.Dispatch<React.SetStateAction<string | null>>;
  clubRole: TitanRole | null;
  setClubRole: React.Dispatch<React.SetStateAction<TitanRole | null>>;
}

export const TitanContext = React.createContext<ITitanContext>({
  user: {},
  setUser: () => {},
  currentClubId: null,
  setCurrentClubId: () => {},
  clubRole: null,
  setClubRole: () => {},
});

export const App: React.FC = () => {
  const [user, setUser] = useState<Partial<IUser>>({ id: "", shownName: "" });
  const [currentClubId, setCurrentClubId] = useState<string | null>(null);
  const [clubRole, setClubRole] = useState<TitanRole | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      if (!localStorage.getItem("token")) throw null;
      const response = await loggedApi.get("/user/me");
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!isReady) {
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
    <TitanContext.Provider
      value={{
        user,
        setUser,
        currentClubId,
        setCurrentClubId,
        clubRole,
        setClubRole,
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/club/:clubId" element={<ClubLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClubDashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="teams" element={<Teams />} />
          <Route path="matches" element={<Matches />} />
          <Route path="trainings" element={<Trainings />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/invite/:code" element={<AcceptInvite />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </TitanContext.Provider>
  );
};
