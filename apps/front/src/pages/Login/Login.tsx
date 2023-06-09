import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { TextInputComponent } from "../../components/UI/TextInputComponent/TextInputComponent";
import { ButtonComponent } from "../../components/UI/Button/ButtonComponent";
import {
  ISigninAuthBody,
  ISigninAuthResponse,
  HttpErrorCode,
} from "vokit_core";
import StoreContext from "../../hook/contexts/StoreContext";
import { api } from "../../axios";

export const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(StoreContext);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorMessage("");

    const querySchema = Joi.object<ISigninAuthBody>({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string().min(5).max(30).required(),
    });

    const result = querySchema.validate({
      username: username,
      password: password,
    });

    if (result.error) {
      setErrorMessage(
        "Les informations fournies ne peuvent pas correspondre à un compte."
      );
      return;
    }

    try {
      const response: { data: { data: ISigninAuthResponse } } = await api.post(
        "/auth/signin",
        {
          ...result.value,
        }
      );
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      setUser(response.data.data.user);
      navigate("/");
    } catch (e: any) {
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case HttpErrorCode.invaliduser:
          setErrorMessage("Ces informations ne correspondent à aucun compte.");
        case HttpErrorCode.badpassword:
          setErrorMessage("Le mot de passe est erroné.");
        case HttpErrorCode.badusername:
          setErrorMessage("Ce compte n'existe pas.");
      }
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (user?.id !== "" && savedUser !== null && savedToken !== null) {
      navigate("/");
    }
  });

  return (
    <div className="Login-Page">
      <form onSubmit={handleSubmit} className="Login-Form coloredCorner">
        <h2>Connexion</h2>
        <div className="Login-inputs">
          <TextInputComponent
            value={username}
            modifyValue={setUsername}
            label={"Nom de compte"}
            id="username"
          />
          <TextInputComponent
            value={password}
            modifyValue={setPassword}
            label={"Mot de passe"}
            id="password"
            type={"password"}
          />
        </div>
        <ButtonComponent label="Se connecter" type="submit" />

        <div
          className="Login-errorMessage"
          style={{ ...(errorMessage ? {} : { border: "none" }) }}
        >
          {errorMessage}
        </div>
        <span className="Login-toSignUp">
          Pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link>
        </span>
      </form>
    </div>
  );
};
