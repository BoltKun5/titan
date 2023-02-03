import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import StoreContext from "./hook/contexts/StoreContext";
import { loggedApi } from "./axios";
import { IUser } from "vokit_core";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Navigation } from "./components/Navigation";

export const App: React.FC = () => {
  const [user, setUser] = useState<null | Partial<IUser>>(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      if (!localStorage.getItem("token")) throw null;
      const response = await loggedApi.get(`/user/me`);
      setUser(response.data.user);
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const store = {
    user,
    setUser,
  };

  return (
    <>
      <div className="main w-100 h-100">
        <Navigation />
        <div className="content w-100 h-100 d-flex">
          <StoreContext.Provider value={store}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </StoreContext.Provider>
        </div>
      </div>
    </>
  );
};
