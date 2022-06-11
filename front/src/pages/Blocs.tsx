import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Card } from "../components/Card";
import TCGdex from '@tcgdex/sdk';
import { CardList } from "../components/CardList";
import defaultImage from '../assets/sets/default.png'
import { Link } from "react-router-dom";

export const Blocs: React.FC = () => {
    const tcgdex = new TCGdex('fr');
    const [series, setSeries] = useState<any[]>();

    const fetchSeries = useCallback(async () => {
        const response = await tcgdex.fetch('sets');
        if (response) {
            setSeries(response);
        }
    }, []);

    useEffect(() => {
        if (!series) fetchSeries()
    }, [series]);


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
