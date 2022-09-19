import React, { useEffect, useState } from "react";
import axios from "axios";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import './Login.scss'
import { HttpErrorCode, ISigninAuthBody, ISigninAuthResponse } from "../../../../local-core";

export const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const querySchema = Joi.object<ISigninAuthBody>({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string().min(5).max(30).required(),
    });

    const result = querySchema.validate({ username: username, password: password });

    if (result.error) {
      setErrorMessage("Les informations fournies ne peuvent pas correspondre à un compte.");
      return
    }

    try {
      const response: { data: { data: ISigninAuthResponse } } = await axios.post("http://localhost:10101/api/auth/signin", {
        ...result.value,
      });
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      navigate("/cards");

    } catch (e: any) {
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case HttpErrorCode.invaliduser:
          setErrorMessage("Ces informations ne correspondent à aucun compte.");
        case HttpErrorCode.badpassword:
          setErrorMessage("Le mot de passe est erroné.")
        case HttpErrorCode.badusername:
          setErrorMessage("Ce compte n'existe pas.")
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
          value={username}
          onChange={e =>
            setUsername(e.target.value)
          } />
      </div>
      <div className="Login-textInputContainer">
        <label>Mot de passe</label>
        <input className="Login-textInput" type={"password"} value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {(errorMessage !== "") && <div className="Login-errorMessage">{errorMessage}</div>}
      <span className="Login-toSignUp">Pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link></span>
      <button className="button" type="submit">Se connecter</button>
    </form>
  </div>
};
