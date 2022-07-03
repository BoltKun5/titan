import React, { ReactElement } from "react";
import style from "../index.css"

type Props = {
    name: string,
    image: string
}


export const Card: React.FC<Props> = ({ name, image }) => {
    return <div className="Collection-Card"><img src={image} /></div>
};
