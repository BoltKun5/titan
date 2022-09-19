import React, { useState } from "react";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import './SignUp.scss'
import { ISigninAuthResponse, ISignupAuthBody } from "../../../../local-core";
import { api } from "../../axios";

export const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shownName, setShownName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const querySchema = Joi.object<ISignupAuthBody>({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string().min(5).max(30).required(),
      shownName: Joi.string().min(3).max(30).required()
    });

    const result = querySchema.validate({ username: username, password: password, shownName: shownName });

    if (result.error) {
      setErrorMessage("Les formats ne sont pas respectés.");
      return
    }

    try {
      const response: { data: { data: ISigninAuthResponse } } = await api.post("/auth/signup", {
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

  return <div className="SignUp-Page">
    <form onSubmit={handleSubmit} className="SignUp-Form">
      <h2>Inscription</h2>
      <div className="SignUp-textInputContainer">
        <label>Nom de compte</label>
        <input className="SignUp-textInput"
          value={username}
          onChange={e =>
            setUsername(e.target.value)
          } />
      </div>
      <div className="SignUp-textInputContainer">
        <label>Pseudo affiché</label>
        <input className="SignUp-textInput" value={shownName} onChange={e => setShownName(e.target.value)} />
      </div>
      <div className="SignUp-textInputContainer">
        <label>Mot de passe</label>
        <input className="SignUp-textInput" type={"password"} value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      {(errorMessage !== "") && <div className="SignUp-errorMessage">{errorMessage}</div>}
      <span className="SignUp-toSignIn">Déjà inscrit ? <Link to="/">Connectez-vous</Link></span>
      <button className="button" type="submit">S'inscrire</button>
    </form>
  </div>
};
