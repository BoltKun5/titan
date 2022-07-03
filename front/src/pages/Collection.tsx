import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Card } from "../components/Card";
import TCGdex from '@tcgdex/sdk';
import { CardList } from "../components/CardList";
import {loggedApi} from "../axios";
import {User} from "../../../api/src/database";

export const Collection: React.FC = () => { 
    const [cards, setCards] = useState<any[]>();
    const user: User = JSON.parse(localStorage.getItem('user') ?? "{}");
    
    const fetchCards = useCallback(async () => {
        const response = await loggedApi.get(`/usercards/${user.id}/getAll`);
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
