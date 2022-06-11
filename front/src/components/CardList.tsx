import React, { useCallback, useEffect, useState } from 'react';
import { Card } from './Card';

type Props = {
    cards: any[]
}

export const CardList: React.FC<Props> = ({cards}) => {
    return <div className='Collection-CardList'>
        {cards.map((card: any) => <Card key={card.id} name={card.name} image={card.image}/>)}
    </div>
}

