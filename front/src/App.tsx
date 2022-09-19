import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { CardManager } from "./pages/CardManager/CardManager";
import { DevelopmentTool } from "./pages/DevelopmentTool/DevelopmentTool";
import { HistoricPage } from './pages/HistoricPage/HistoricPage';
import { SignUp } from './pages/SignUp/SignUp';

export const App: React.FC = () => {
  return <div className="main">
    <div className="content">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cards" element={<CardManager />} />
        <Route path="/devtool" element={<DevelopmentTool />} />
        <Route path="/historic" element={<HistoricPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  </div>
}
