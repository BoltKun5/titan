import React, {ReactElement, useCallback, useEffect, useState} from "react";
import TCGdex from '@tcgdex/sdk';
import {CardList} from "../components/CardList";
import defaultImage from '../assets/sets/default.png'
import {Link} from "react-router-dom";
import {api} from "../axios";

export const Series: React.FC = () => {
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

  return <div className="Bloc-List">
    {series.slice(0).reverse().map((el: { id: string, name: string, code: string }) => {
      return <Link className="Bloc-Link" key={el.id} to={"/series/" + el.code}>
        <div className="Bloc-Image">
          <img width="50%" src={defaultImage}/>
        </div>
        <div className="Bloc-Title">{el.name}</div>
      </Link>
    })}
  </div>
};
