import React from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import {Series} from './pages/Series';
import {SingleSet} from './pages/SingleSet';
import {Collection} from './pages/Collection';
import {Login} from './pages/Login';
import {Prehome} from './pages/Prehome';
import {SingleSerie} from './pages/SingleSerie';

export const App: React.FC = () => {
  //TODO: Mettre dans un composant
  return <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/prehome" element={<Prehome/>}/>
    <Route path="/series" element={<Series/>}/>
    <Route path="/series/:serieId" element={<SingleSerie/>}/>
    <Route path="/series/:id/:setId" element={<SingleSet/>}/>
    <Route path="/collection" element={<Collection/>}/>
  </Routes>
}
