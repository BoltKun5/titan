import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StoreContext from '../../hook/contexts/StoreContext';
import './style.scss';
import { Close, Menu } from '@mui/icons-material';
import { ClickAwayListener, Grow } from '@mui/material';
import { isUserConnected } from '../../general.utils';
import { ButtonComponent } from '../UI/Button/ButtonComponent';

export const HeaderComponent: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listenToClose, setListenToClose] = useState(false);

  const navigate = useNavigate();

  const disconnect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser({ id: '' });
    navigate('/');
  };

  const { user, setUser } = useContext(StoreContext);

  const location = useLocation();

  const getButtonClassName = (path: string) => {
    return (
      'HeaderComponent-navButton' +
      (location.pathname === path ? ' HeaderComponent-selectedButton' : '')
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
              'HeaderComponent-navButtons ' + (isMobileMenuOpen ? 'isOpen' : '')
            }
          >
            <Link to={'/'} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={getButtonClassName('/')}>
                <img src="/assets/logo.png" className="Logo"></img>
                CARTES
              </div>
            </Link>
            <Link to={'/stats'} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={getButtonClassName('/stats')}>STATISTIQUES</div>
            </Link>
            <Link to={'/opening'} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={getButtonClassName('/opening')}>OUVERTURE</div>
            </Link>
            {/* <Link to={'/historic'}>
          <div className={getButtonClassName('/historic')}>HISTORIQUE</div>
        </Link> */}
          </nav>
          <div className="HeaderComponent-misc">
            <div
              className="HeaderComponent-profile"
              onClick={() => {
                setIsProfileDropdownOpen(true);
                setTimeout(() => {
                  setListenToClose(true);
                }, 500);
              }}
            >
              <div className="HeaderComponent-profilePicture">
                <img
                  src={`/assets/profile_picture/${
                    user?.options?.profilePicture ?? 1
                  }.png`}
                />
              </div>
            </div>
          </div>

          <Grow in={isProfileDropdownOpen}>
            <div>
              <ClickAwayListener
                onClickAway={() => {
                  if (listenToClose) {
                    setIsProfileDropdownOpen(false);
                    setListenToClose(false);
                  }
                }}
              >
                <div className="HeaderComponent-profileOptions">
                  <Link
                    to={'/profile'}
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setListenToClose(false);
                    }}
                  >
                    <div className="HeaderComponent-profileButtons">
                      Mon profil
                    </div>
                  </Link>
                  <div
                    className="HeaderComponent-profileButtons"
                    onClick={() => disconnect()}
                  >
                    Se déconnecter
                  </div>
                </div>
              </ClickAwayListener>
            </div>
          </Grow>
        </>
      ) : (
        <div className="HeaderComponent-disconnectedHeader">
          <div className="HeaderComponent-fullLogo">
            <Link to={'/'}>
              <img src={'/assets/logo_full_big.png'} />
            </Link>
          </div>
          <div className="HeaderComponent-loginLinks">
            <Link to="/login">
              <ButtonComponent
                label={'Se connecter'}
                weight={'normal'}
                fontSize={15}
                size={105}
                height={35}
                hoverOffset={3}
                clipPath={6}
              />
            </Link>
            <Link to="/signup">
              <ButtonComponent
                label={"S'inscrire"}
                weight={'normal'}
                fontSize={15}
                size={100}
                height={35}
                hoverOffset={3}
                clipPath={6}
              />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
