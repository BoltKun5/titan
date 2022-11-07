import React, { useCallback, useContext, useState } from "react";
import './style.scss'
import { useFetchData } from "../../hook/api/cards";
import { ICard } from "../../../../local-core";
import LoginContext from "../../hook/contexts/LoginContext";
import { SingleCardComponent } from "../../components/SingleCardComponent/SingleCardComponent";

export const DevelopmentTool: React.FC = () => {
  const [cards, setCards] = useState<ICard[]>([]);
  const { isLoading, fetch } = useFetchData();
  const [init, setInit] = useState(false)

  const { currentUser } = useContext(LoginContext);



  const initialRarityFilter = [
    {
      rarity: "Common",
      value: false
    },
    {
      rarity: "Uncommon",
      value: false
    },
    {
      rarity: "Rare",
      value: false
    },
    {
      rarity: "Holo",
      value: false
    },
    {
      rarity: "Ultra Rare",
      value: false
    },
    {
      rarity: "Secret Rare",
      value: false
    },
    {
      rarity: "None",
      value: false
    }
  ]
  const [rarityFilter, setRarityFilter] = useState<any[]>(initialRarityFilter);


  const fetchCards = useCallback(async () => {
    const response: any = await fetch('/devtool/bugged', {});
    setCards(response.cards)
  }, [])

  if (!init) {
    fetchCards();
    setInit(true)
  }

  return currentUser?.role === 1 ? (
    <div>
      Accès refusé
    </div>
  ) : (
    <div className="Devtool">
      {cards.map((card: any, index: number) =>
        <React.Fragment key={"firstCard" + card.localId + "0" + index}>
          <SingleCardComponent firstType={'classic'} card={card} index={index} />

        </React.Fragment>,
      )}
    </div>
  )
};
