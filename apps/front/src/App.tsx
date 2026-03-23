import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { SignUp } from './pages/SignUp/SignUp';
import { Conversations } from './pages/Conversations/Conversations';
import { Chat } from './pages/Chat/Chat';
import { HeaderComponent } from './components/HeaderComponent/HeaderComponent';
import StoreContext from './hook/contexts/StoreContext';
import { loggedApi } from './axios';
import { isUnloggedPage } from './general.utils';
import { INotificationElement } from './local-core/interface';
import { Loader } from './components/UI/Loader/LoaderComponent';
import { IUser } from 'titan_core';
import { useSnackbar } from 'notistack';

export const App: React.FC = () => {
  const [notifications, setNotifications] = useState<INotificationElement[]>(
    [],
  );
  const [user, setUser] = useState<Partial<IUser>>({
    id: '',
    role: 0,
    shownName: '',
  });

  const [isReady, setIsReady] = useState(false);

  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      if (!localStorage.getItem('token')) {
        throw null;
      }
      const response = await loggedApi.get(`/user/me`);
      setUser(response.data.user);
    } catch (e) {
      if (!isUnloggedPage()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUser();
  }, []);

  const store = {
    user,
    setUser,
    notifications,
    setNotifications,
  };

  const showHeader = () => {
    const hideHeaderPaths = ['/login', '/signup', '/chat', '/conversations'];
    const path = window.location.pathname;
    return !hideHeaderPaths.some((p) => path.startsWith(p));
  };

  const handleResizeForMobile = () => {
    const vh = window.innerHeight * 0.01;
    document.querySelector('body')?.style.setProperty('--vh', `${vh}px`);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResizeForMobile);
    return () => window.removeEventListener('resize', handleResizeForMobile);
  }, []);

  handleResizeForMobile();

  return (
    <>
      {isReady ? (
        <div className="main">
          <div className="content">
            <StoreContext.Provider value={store}>
              {showHeader() && <HeaderComponent />}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/chat/:conversationId" element={<Chat />} />
                <Route
                  path="*"
                  element={
                    user.id ? (
                      <Navigate to="/conversations" replace />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
              </Routes>
            </StoreContext.Provider>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
