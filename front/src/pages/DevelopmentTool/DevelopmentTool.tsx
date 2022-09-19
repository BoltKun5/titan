import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import './DevelopmentTool.scss'
import { useFetchData } from "../../hook/api/cards";
import { CardRarityEnum, ICard } from "../../../../local-core";
import { api } from "../../axios";
import LoginContext from "../../hook/contexts/LoginContext";

export const DevelopmentTool: React.FC = () => {
  const [cards, setCards] = useState<ICard[]>([]);
  const [currentCard, setCurrentCard] = useState<ICard | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
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
    const params = { rarity: [8], order: "default" };
    const response: any = await fetch('/cardlist/cards', params);
    setCards(response.data)
  }, [])

  const getToNextCard = () => {
    setCurrentIndex(currentIndex + 1)
  }

  useEffect(() => {
    setCurrentCard(cards[currentIndex]);
  }, [currentIndex, cards])

  if (!init) {
    fetchCards()
    console.log(cards)
    setCurrentIndex(0)
    setInit(true)
  }

  const updateRarity = async (filter: any) => {
    try {
      await api.post("/devtool/rarity", {
        rarity: CardRarityEnum[filter.rarity],
        // @ts-ignore
        cardId: currentCard.id
      });
      setCurrentIndex(currentIndex + 1)
    } catch (e) {

    }
  }


  return currentUser?.role === 1 ? (
    <div>
      Accès refusé
    </div>
  ) : currentCard === null || currentCard === undefined ? (
    <div>

    </div>
  ) : (
    <div className="MassInput">
      <div className="MassInput-modale">
        <div className="MassInput-image">
          <img src={"src/assets/cards/" + currentCard.cardSet.code + "/" + Number(currentCard.localId) + ".jpg"} />
        </div>
        <div className="MassInput-informations MassInput-overrideCounter" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {
            rarityFilter.map((filter) =>
              <React.Fragment key={"rarity" + filter.rarity}>
                <div className={"CardManagerFilter-rarityContainer "} style={{ width: 80, height: 80 }} onClick={() => (updateRarity(filter))} >
                  <img className="CardManagerFilter-rarityImg" src={"./src/assets/icons/" + filter.rarity + ".png"} />
                </div>
              </React.Fragment>,
            )
          }
          <button className="MassInput-button" onClick={() => getToNextCard()}>Carte suivante
          </button>
        </div>
      </div>
    </div>
  )
};
