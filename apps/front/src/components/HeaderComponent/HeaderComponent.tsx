import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StoreContext from "../../hook/contexts/StoreContext";
import "./style.scss";
import { UserRoleEnum } from "vokit_core";
import { Close, Menu } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/material";

export const HeaderComponent: React.FC<{
  forceRender: boolean;
  setForceRender: Function;
}> = ({ forceRender, setForceRender }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const disconnect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    setForceRender(!forceRender);
  };

  const { user } = useContext(StoreContext);

  const location = useLocation();

  const getButtonClassName = (path: string) => {
    return (
      "HeaderComponent-navButton" +
      (location.pathname === path ? " HeaderComponent-selectedButton" : "")
    );
  };

  return (
    <header className="HeaderComponent">
      <div className="HeaderComponent-burgerIcon">
        {isMobileMenuOpen ? (
          <Close
            style={{ width: 40, height: 40 }}
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          />
        ) : (
          <Menu
            style={{ width: 40, height: 40 }}
            onClick={() => {
              setIsMobileMenuOpen(true);
            }}
          />
        )}
      </div>
      <nav
        className={
          "HeaderComponent-navButtons " + (isMobileMenuOpen ? "isOpen" : "")
        }
      >
        <Link to={"/cards"} onClick={() => setIsMobileMenuOpen(false)}>
          <div className="HeaderComponent-navButton HeaderComponent-mainButton">
            CARTES
          </div>
        </Link>
        <Link to={"/stats"} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={getButtonClassName("/stats")}>STATISTIQUES</div>
        </Link>
        <Link to={"/opening"} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={getButtonClassName("/opening")}>OUVERTURE</div>
        </Link>
        {/* <Link to={'/historic'}>
          <div className={getButtonClassName('/historic')}>HISTORIQUE</div>
        </Link> */}
      </nav>
      <div className="HeaderComponent-misc">
        <div
          className="HeaderComponent-profile"
          onClick={() => setIsProfileDropdownOpen(true)}
        >
          <div className="HeaderComponent-profilePicture">
            <img
              src={"src/assets/logo_small.png"}
              style={{
                filter: isProfileDropdownOpen
                  ? "brightness(1)"
                  : "brightness(0.7)",
              }}
            />
          </div>
        </div>
      </div>
      {isProfileDropdownOpen && (
        <ClickAwayListener onClickAway={() => setIsProfileDropdownOpen(false)}>
          <div className="HeaderComponent-profileOptions">
            {user.role === UserRoleEnum["ADMIN"] && (
              <Link to="/admin">
                <div className="HeaderComponent-profileButtons">
                  Administration
                </div>
              </Link>
            )}
            <div
              className="HeaderComponent-profileButtons"
              onClick={() => disconnect()}
            >
              Se déconnecter
            </div>
          </div>
        </ClickAwayListener>
      )}
    </header>
  );
};
