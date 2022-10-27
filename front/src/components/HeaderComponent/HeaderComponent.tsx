import { ClickAwayListener } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.scss';

export const HeaderComponent: React.FC<{}> = ({ }) => {

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigate = useNavigate()

  const disconnect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/')
  }

  return (
    <header className="HeaderComponent">
      <nav className="HeaderComponent-navButtons">
        <div className="HeaderComponent-navButton HeaderComponent-mainButton">CARTES</div>
        <div className="HeaderComponent-navButton">STATISTIQUES</div>
        <div className="HeaderComponent-navButton">BOOSTER</div>
        <div className="HeaderComponent-navButton">HISTORIQUE</div>
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
