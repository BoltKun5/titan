import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {CardList} from "../components/CardList";
import {api} from "../axios";

export const SingleSet: React.FC = () => {
  const [cards, setCards] = useState<any[]>();

  const fetchCards = useCallback(async () => {
    const response = await api.get(`/cardlist/SSH/1`);
    setCards(response.data.data.set.cards);
  }, []);
  useEffect(() => {
    if (cards) return;
    fetchCards()
  }, [cards, fetchCards]);

  if (!cards) {
    return <span>Loading</span>
  }
  return <div className="Collection-Main">
    <CardList cards={cards}/>
  </div>
};
