import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ISigninAuthBody, ISigninAuthResponse } from "../../../../api/src/local-core/types/types/interface";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import './Login.scss'

export const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("BoltKun");
  const [password, setPassword] = useState("lolilo22912");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const querySchema = Joi.object<ISigninAuthBody>({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string().min(5).max(30).required(),
    });

    const result = querySchema.validate({ username: username, password: password });

    try {
      const response: { data: { data: ISigninAuthResponse } } = await axios.post("http://localhost:10101/api/auth/signin", {
        ...result.value,
      });
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
      navigate("/cards");

    } catch (e: any) {
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case "USER_NOT_FOUND":
          setErrorMessage("Mauvais identifiants");
      }
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user !== null && token !== null) {
      navigate("/cards");
    }
  })

  return <div className="Login-Page">
    <form onSubmit={handleSubmit} className="Login-Form">
      <h2>Connexion</h2>
      <div className="Login-textInputContainer">
        <label>Nom de compte</label>
        <input className="Login-textInput"
          id="username"
          value={username}
          onChange={e =>
            setUsername(e.target.value)
          } />
      </div>
      <div className="Login-textInputContainer">
        <label>Mot de passe</label>
        <input className="Login-textInput" id="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {(errorMessage !== "") && <div>{errorMessage}</div>}
      <button className="button" type="submit">Se connecter</button>
    </form>
  </div>
};
