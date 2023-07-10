import { useContext, useState } from "react";
import { api, loggedApi } from "../../axios";
import StoreContext from '../contexts/StoreContext';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export const useRelogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(StoreContext);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const handleRelogin = async () => {
    setUser({
      id: "",
      role: 0,
      shownName: "",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    enqueueSnackbar('Votre connexion a expirée.')
  };

  return {
    handleRelogin
  };
};
