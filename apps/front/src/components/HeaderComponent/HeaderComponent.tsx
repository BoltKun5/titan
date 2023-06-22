import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StoreContext from "../../hook/contexts/StoreContext";
import "./style.scss";
import { UserRoleEnum } from "vokit_core";
import { Close, Menu } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/material";
import { isUnloggedPage, isUserConnected } from "../../general.utils";
import { useSnackbar } from "notistack";
import { ButtonComponent } from "../UI/Button/ButtonComponent";

export const HeaderComponent: React.FC<{
  forceRender: boolean;
  setForceRender: Function;
}> = ({ forceRender, setForceRender }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const disconnect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({ id: "" });
    navigate("/");
    // setForceRender(!forceRender);
  };

  const { user, setUser } = useContext(StoreContext);

  const location = useLocation();

  const getButtonClassName = (path: string) => {
    return (
      "HeaderComponent-navButton" +
      (location.pathname === path ? " HeaderComponent-selectedButton" : "")
    );
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(
      import.meta.env.VITE_BASE_URL + "/collection/" + user.id
    );
    enqueueSnackbar(
      "Le lien de partage de votre collection a été copié dans le presse-papier."
    );
  };

  return (
    <header className="HeaderComponent">
      {isUserConnected() ? (
        <>
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
            <Link to={"/"} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={getButtonClassName("/")}>
                <img src="./assets/logo.png" className="Logo"></img>
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
                  src={"./assets/logo_small.png"}
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
            <ClickAwayListener
              onClickAway={() => setIsProfileDropdownOpen(false)}
            >
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
                  onClick={() => copyShareLink()}
                >
                  Partager ma collection
                </div>
                <div
                  className="HeaderComponent-profileButtons"
                  onClick={() => disconnect()}
                >
                  Se déconnecter
                </div>
              </div>
            </ClickAwayListener>
          )}
        </>
      ) : (
        <div className="HeaderComponent-disconnectedHeader">
          <div className="HeaderComponent-fullLogo">
            <img src={"./assets/logo_full.png"} />
          </div>
          <div className="HeaderComponent-loginLinks">
            <Link to="/login">
              <ButtonComponent label={"Se connecter"} weight={'normal'} fontSize={15} size={120} height={40} preset='secondary' hoverOffset={3} clipPath={10} />
            </Link>
            <Link to="/signup">
              <ButtonComponent label={"S'inscrire"} weight={'normal'} fontSize={15} size={120} height={40} preset='secondary' color="secondary" hoverOffset={3} clipPath={10} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
