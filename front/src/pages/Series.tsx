import React, { ReactElement, useCallback, useEffect, useState } from "react";
import TCGdex from '@tcgdex/sdk';
import { CardList } from "../components/CardList";
import defaultImage from '../assets/sets/default.png'
import { Link } from "react-router-dom";
import {api} from "../axios";

export const Series: React.FC = () => {
    const [series, setSeries] = useState<any[]>();

    const fetchSeries = useCallback(async () => {
        const response = await api.get(`/cardlist/allSeries`);
        setSeries(response.data.data.set.cards);
    }, []);
    useEffect(() => {
        if (series) return;
        fetchSeries()
    }, [series, fetchSeries]);


    if (!series) {
        return <span>Loading</span>
    }

    return <div className="Bloc-List">
        {series.slice(0).reverse().map((el: { id: string, name: string, logo: string }) => {
            return <Link className="Bloc-Link" key={el.id} to={"/blocs/"+el.id}>
                    <div className="Bloc-Image">
                        <img width='50%' src={el.logo ?? defaultImage} />
                    </div>
                    <div className="Bloc-Title">{el.logo ? '' : el.name}</div>
            </Link>
        })}
    </div>
};
