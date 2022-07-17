import React from "react";
import {Route, Routes, useParams} from "react-router-dom";
import {Login} from "./Login";
import {Prehome} from "./Prehome";
import {Collection} from "./Collection";
import {CardManager} from "./CardManager";
import logo from "../assets/logo.png";

export const GlobalRouter: React.FC = () => {
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
        <Route path="/prehome" element={<Prehome/>}/>
        <Route path="/cards" element={<CardManager/>}/>
      </Routes>
    </div>
  </div>
};
