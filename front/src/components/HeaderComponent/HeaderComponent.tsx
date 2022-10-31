import { ClickAwayListener } from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './style.scss';

export const HeaderComponent: React.FC<{}> = ({ }) => {

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigate = useNavigate()

  const disconnect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/')
  }

  const location = useLocation();

  const getButtonClassName = (path: string) => {
    return "HeaderComponent-navButton" + (location.pathname === path ? " HeaderComponent-selectedButton" : "");
  }

  return (
    <header className="HeaderComponent">
      <nav className="HeaderComponent-navButtons">
        <Link to={'/cards'}>
          <div className="HeaderComponent-navButton HeaderComponent-mainButton">CARTES</div>
        </Link>
        <Link to={'/stats'}>
          <div className={getButtonClassName('/stats')}>STATISTIQUES</div>
        </Link>
        <Link to={'/opening'}>
          <div className={getButtonClassName('/opening')}>BOOSTER</div>
        </Link>
        <Link to={'/historic'}>
          <div className={getButtonClassName('/historic')}>HISTORIQUE</div>
        </Link>
      </nav>
      <div className="HeaderComponent-misc">
        <div className="HeaderComponent-profile" onClick={() => setIsProfileDropdownOpen(true)}>
          <div className="HeaderComponent-profilePicture">
            <img src={"src/assets/default_profile_picture.png"} />
          </div>
        </div>
      </div>
      {
        isProfileDropdownOpen && (
          <ClickAwayListener onClickAway={() => setIsProfileDropdownOpen(false)}>
            <div className="HeaderComponent-profileOptions">
              <div className="HeaderComponent-profileButtons" onClick={() => disconnect()}>Se déconnecter</div>
            </div>
          </ClickAwayListener>
        )
      }

    </header>
  )
}
