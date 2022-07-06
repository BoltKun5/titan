import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import collection from '../assets/prehome/collection.png'
import extensions from '../assets/prehome/extensions.png'

export const Prehome: React.FC = () => {
    return <div className="Prehome-Hub">
        <Link to="/collection" className="Prehome-MenuOption">
            <img src={collection} width="30%"></img>
            <div className="Prehome-MenuTitle">Ma collection</div></Link>
        <Link to="/series" className="Prehome-MenuOption">
            <img src={extensions} width="40%"></img>
            <div className="Prehome-MenuTitle">Cartes par extensions</div></Link>
    </div >
};
