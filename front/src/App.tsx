import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login/Login";
import {CardManager} from "./pages/CardManager/CardManager";

export const App: React.FC = () => {
  return <div className="main">
    <div className="content">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/cards" element={<CardManager/>}/>
      </Routes>
    </div>
  </div>
}
