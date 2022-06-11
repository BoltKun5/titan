import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Card } from "../components/Card";
import TCGdex from '@tcgdex/sdk';
import { CardList } from "../components/CardList";

export const Collection: React.FC = () => { 
    const tcgdex = new TCGdex('fr');
    const [cards, setCards] = useState<any[]>();
    
    const fetchCards = useCallback(async () => {
        const response = await tcgdex.fetch('cards', 'bw2-98');
        setCards([response]);
    }, []);
    useEffect(() => {
        if (!cards) fetchCards()
    }, [cards]);
    
    
    if (!cards) {
        return <span>Loading</span>
    }
    return <div className="Collection-Main">
        <CardList cards={cards} />
    </div>
  };
