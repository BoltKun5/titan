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
                ACCUEIL
              </div>
            </Link>
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
                {user?.shownName?.charAt(0)?.toUpperCase() ?? 'U'}
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
              <span className="HeaderComponent-title">Titan</span>
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
