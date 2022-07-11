import React, {ReactElement, useCallback, useEffect, useState} from "react";
import logo from '../assets/logo.png'
import {Link} from "react-router-dom";
import {api} from "../axios";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import img from "../assets/img.png"

export const CardManager: React.FC = () => {
  const [series, setSeries] = useState<any[]>();

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
        series.map((serie) => (
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            icon={<img src={img}/>}
            direction="right"
          >
            {serie.set.map((serie) => (
              <SpeedDialAction
                key={serie.code}
                icon={serie.icon}
                tooltipTitle={serie.name}
              />
            ))
            }
          </SpeedDial>))}
    </div>
  </div>
};
