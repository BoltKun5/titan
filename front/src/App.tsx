import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login/Login";
import {CardManager} from "./pages/CardManager/CardManager";
import logo from './assets/logo.png'

export const App: React.FC = () => {
  return <div className="main">
    <div className="Navbar">
      <img className="Navbar-logo" src={logo}/>
      <nav className="Navbar-navBar">
        <div className="Navbar-navBarElement">Gestionnaire</div>
        <div className="Navbar-navBarElement">Gestion2naire</div>
      </nav>
    </div>
    <div className="content">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/cards" element={<CardManager/>}/>
      </Routes>
    </div>
  </div>
}
