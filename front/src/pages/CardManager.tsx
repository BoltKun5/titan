import React, {ReactElement, useCallback, useEffect, useState} from "react";
import logo from '../assets/logo.png'
import {Link} from "react-router-dom";
import {api} from "../axios";
import {SpeedDial, SpeedDialAction, SpeedDialIcon, Switch, TextField} from "@mui/material";
import img from "../assets/img.png"
import img2 from "../assets/img_1.png"
import {CardSet} from "../../../api/src/database";
import {CardList} from "../components/CardList";

export const CardManager: React.FC = () => {
  const [series, setSeries] = useState<any[]>();
  const [filters, setFilters] = useState<any[]>();
  const [collectionMode, setCollectionMode] = useState<boolean>(false);
  const [separateReverse, setSeparateReverse] = useState<boolean>(false);
  const [showUnowned, setShowUnowned] = useState<boolean>(false);

  const fetchSeries = useCallback(async () => {
    const response = await api.get(`/cardlist/allSeries`);
    setSeries(response.data.data);
  }, []);
  useEffect(() => {
    if (series) return;
    fetchSeries()
  }, [series, fetchSeries]);

  if (!series) {
    return <span>Loading</span>
  }

  return <div className="Manager">
    <div className="Manager-leftBar">
      {
        series.map((serie, index) => (
          <div className="Manager-leftBar-serie" key={serie.code}>
            <SpeedDial
              key={serie.code}
              ariaLabel="serie dial"
              icon={<img className="Manager-leftBar-serieImage" src={index === 0 ? img : img2}/>}
              direction="right"
            >
              {serie.cardSets.map((set: CardSet) => (
                <SpeedDialAction
                  className="Manager-leftBar-set"
                  key={set.code}
                  icon={<img className="Manager-leftBar-setIcon" width="35px" height="35px"
                             src={`https://assets.tcgdex.net/univ/${serie.code}/${set.code}/symbol`}/>}
                  tooltipTitle={set.name}
                />
              ))
              }
            </SpeedDial></div>))}
    </div>
    <div className="Manager-mainContent">
      <div className="Manager-filter">
        <div className="Manager-filter-left">
          <TextField className="Manager-filter-textInput" id="outlined-basic" label="Filtrer par nom"
                     variant="outlined"/>
        </div>
        <div className="Manager-filter-middle">

        </div>

        <div className="Manager-filter-right">
          <div className="Manager-filter-switchInput">
            <label htmlFor={"collectionMode"} className={collectionMode ? "Manager-filter-switchInput-activated" : ""}>
              Activer le mode Collection
              <div className={"Manager-filter-switchInput-light"}/>
            </label>
            <input type={"checkbox"} onChange={e => setCollectionMode(e.target.checked)} id={"collectionMode"}/>
          </div>
          <div className="Manager-filter-switchInput">
            <label htmlFor={"separateReverse"}
                   className={!collectionMode ? "Manager-filter-switchInput-disabled" : separateReverse ? "Manager-filter-switchInput-activated" : ""}>
              Séparer les cartes Reverse
              <div className={"Manager-filter-switchInput-light"}/>
            </label>
            <input type={"checkbox"} onChange={e => setSeparateReverse(e.target.checked)} id={"separateReverse"}/>
          </div>
          <div className="Manager-filter-switchInput">
            <label htmlFor={"showUnowned"}
                   className={!collectionMode ? "Manager-filter-switchInput-disabled" : showUnowned ? "Manager-filter-switchInput-activated" : ""}>
              Afficher les cartes non-possédées
              <div className={"Manager-filter-switchInput-light"}/>
            </label>
            <input type={"checkbox"} onChange={e => setShowUnowned(e.target.checked)} id={"showUnowned"}/>
          </div>
        </div>


      </div>
      <div className="Manager-cardList">
        <CardList cards={[]} setId={"1"} serieId={"1"}/>
      </div>
    </div>
  </div>
};
