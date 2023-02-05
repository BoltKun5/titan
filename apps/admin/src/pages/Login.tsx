import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISigninAuthResponse, HttpErrorCode } from "vokit_core";
import StoreContext from "../hook/contexts/StoreContext";
import { api } from "../axios";
import { Button, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(StoreContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const result = {
      username: username,
      password: password,
    };

    try {
      const response: { data: { data: ISigninAuthResponse } } = await api.post(
        "/auth/signin",
        {
          ...result,
        }
      );
      localStorage.setItem("token", response.data.data.token);
      setUser(response.data.data.user);
      navigate("/home");
    } catch (e: any) {
      console.log(e);
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case HttpErrorCode.invaliduser:
          enqueueSnackbar("Ces informations ne correspondent à aucun compte.");
        case HttpErrorCode.badpassword:
          enqueueSnackbar("Le mot de passe est erroné.");
        case HttpErrorCode.badusername:
          enqueueSnackbar("Ce compte n'existe pas.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  });

  return (
    <form className="d-flex align-items-center justify-content-center flex-column bg-light container w-25 rounded py-5 m-auto">
      <h2>Connexion</h2>
      <div className="d-flex flex-column">
        <TextField
          margin={"dense"}
          value={username}
          onChange={(ev) => setUsername(ev.currentTarget.value)}
          label={"Nom de compte"}
          id="username"
        />
        <TextField
          margin={"dense"}
          value={password}
          onChange={(ev) => setPassword(ev.currentTarget.value)}
          label={"Mot de passe"}
          id="password"
          type={"password"}
        />
      </div>
      <Button style={{ margin: 5 }} variant="contained" onClick={handleSubmit}>
        Connexion
      </Button>
    </form>
  );
};
