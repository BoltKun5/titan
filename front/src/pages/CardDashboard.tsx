import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {CardList} from "../components/CardList";
import {api} from "../axios";
import {useParams} from "react-router-dom";

export const SingleSet: React.FC = () => {
  const [cards, setCards] = useState<any[]>();
  const {serieId, setId} = useParams();
  const fetchCards = useCallback(async () => {
    const response = await api.get(`/cardlist/set/${setId}`);
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
