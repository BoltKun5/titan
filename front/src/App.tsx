import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Blocs } from './pages/Blocs';
import { Bloc } from './pages/Bloc';
import { Collection } from './pages/Collection';
import { Login } from './pages/Login';
import { Prehome } from './pages/Prehome'

export const App: React.FC = () => {
  return <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/prehome" element={<Prehome />} />
    <Route path="/blocs" element={<Blocs />} />
    <Route path="/collection" element={<Collection />} />
    <Route path="/blocs/:id" element={<Bloc />} />
  </Routes>
}

