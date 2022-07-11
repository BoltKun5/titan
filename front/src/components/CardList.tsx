import React, {useCallback, useEffect, useState} from 'react';
import {Card} from './Card';

type Props = {
  cards: any[],
  setId: string,
  serieId: string
}

export const CardList: React.FC<Props> = ({cards, setId, serieId}) => {
  return <div className="Collection-CardList">
    {cards.map((card: any) => <Card key={card.id}
                                    name={card.name}
                                    image={"https://assets.tcgdex.net/fr/" + serieId + "/" + setId + "/" + Number(card.localId) + "/low.jpg"}/>)}
  </div>
}
