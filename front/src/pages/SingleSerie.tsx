import React, {ReactElement, useCallback, useEffect, useState} from "react";
import TCGdex from '@tcgdex/sdk';
import {CardList} from "../components/CardList";
import defaultImage from '../assets/sets/default.png'
import {Link, useParams} from "react-router-dom";
import {api} from "../axios";
import {CardSerie, CardSet} from "../../../api/src/database";

export const SingleSerie: React.FC = () => {
  const [serie, setSerie] = useState<CardSerie>();
  const {serieId} = useParams();
  const fetchSerie = useCallback(async () => {
    const response = await api.get(`/cardlist/serie/${serieId}`);
    setSerie(response.data.data.serie);
  }, []);
  useEffect(() => {
    if (serie) return;
    fetchSerie()
  }, [serie, fetchSerie]);

  if (!serie) {
    return <span>Loading</span>
  }

  return <div className="Set-List">
    {serie.cardSets.map((el: CardSet) => {
      return <Link className="Set-Link" key={el.id} to={el.code}>
        <div className="Set-Image">
          <img width="50%" src={defaultImage}/>
        </div>
        <div className="Set">{el.name}</div>
      </Link>
    })}
  </div>
};
