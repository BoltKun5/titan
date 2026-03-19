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
} from "titan_core";
import StoreContext from "../../hook/contexts/StoreContext";
import { api } from "../../axios";
import { useSnackbar } from "notistack";

export const Login: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(StoreContext);
  const { enqueueSnackbar } = useSnackbar();

  const querySchema = Joi.object<ISigninAuthBody>({
    mail: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(5).required(),
  });

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const result = querySchema.validate({
      mail,
      password,
    });

    if (result.error) {
      enqueueSnackbar(
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
          enqueueSnackbar("Ces informations ne correspondent à aucun compte.");
          break;
        case HttpErrorCode.badpassword:
          enqueueSnackbar("Le mot de passe est erroné.");
          break;
        case HttpErrorCode.badusername:
          enqueueSnackbar("Ce compte n'existe pas.");
          break;
        case HttpErrorCode.inactiveAccount:
          enqueueSnackbar("L'adresse e-mail de ce compte n'a pas été validée. Un nouveau mail de validation vous a été envoyé.");
          break;
        default: enqueueSnackbar("Une erreur est survenue.")
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
        <Link to={"/"}>
          <div className="BackButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="square" strokeLinejoin={"arcs" as any}><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
          </div>
        </Link>
        <div className="Logo"><img src="/assets/logo_full_big.png" /></div>
        <h3>Connexion</h3>
        <div className="Login-inputs">
          <TextInputComponent
            value={mail}
            modifyValue={setMail}
            label={"Adresse mail"}
            id="mail"
          />
          <TextInputComponent
            value={password}
            modifyValue={setPassword}
            label={"Mot de passe"}
            id="password"
            type={"password"}
          />
          <div className="Login-renewPassword">
            <Link to={'/renew-password'}>Mot de passe oublié</Link>
          </div>
        </div>
        <ButtonComponent label="Se connecter" type="submit" disabled={!!querySchema.validate({ mail, password })?.error} />
        <span className="Login-toSignUp">
          Pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link>
        </span>
      </form>
    </div>
  );
};
