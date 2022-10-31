import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { CardManager } from "./pages/CardManager/CardManager";
import { DevelopmentTool } from "./pages/DevelopmentTool/DevelopmentTool";
import { HistoricPage } from './pages/HistoricPage/HistoricPage';
import { SignUp } from './pages/SignUp/SignUp';
import { Opening } from './pages/Opening/Opening';
import { HeaderComponent } from './components/HeaderComponent/HeaderComponent';
import StoreContext from './hook/contexts/StoreContext';
import { CardSetFilterInterface, ICardSerie, ICardSet } from '../../local-core';
import { api, loggedApi } from './axios';

export const App: React.FC = () => {

  const [series, setSeries] = useState<ICardSerie[]>([]);

  const fetchSeries = useCallback(async () => {
    const response = await api.get(`/series/allSeries`);
    setSeries(response.data.data);
  }, []);

  const store = {
    series
  }

  useEffect(() => {
    if (series.length > 0) {
      return;
    }
    fetchSeries();
  }, [series, fetchSeries]);

  return <div className="main">
    <div className="content">
      <StoreContext.Provider value={store} >
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cards" element={<CardManager />} />
          <Route path="/opening" element={<Opening />} />
          <Route path="/devtool" element={<DevelopmentTool />} />
          <Route path="/historic" element={<HistoricPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </StoreContext.Provider>
    </div>
  </div>
}
