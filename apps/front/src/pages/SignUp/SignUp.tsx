import React, { useContext, useState } from "react";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { api } from "../../axios";
import { TextInputComponent } from "../../components/UI/TextInputComponent/TextInputComponent";
import { ButtonComponent } from "../../components/UI/Button/ButtonComponent";
import { ISignupAuthBody, ISigninAuthResponse } from "vokit_core";
import StoreContext from "../../hook/contexts/StoreContext";

export const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [shownName, setShownName] = useState("");
  const [mail, setMail] = useState("");
  const navigate = useNavigate();

  const { setUser } = useContext(StoreContext)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const querySchema = Joi.object<ISignupAuthBody>({
      password: Joi.string().min(5).max(30).required(),
      shownName: Joi.string().min(2).max(30).required(),
      mail: Joi.string().email({ tlds: { allow: false } }).required()
    });

    const result = querySchema.validate({
      password,
      shownName,
      mail
    });

    if (result.error) {
      setErrorMessage("Les données ne sont pas valides.");
      return;
    }

    try {
      const response: { data: { data: ISigninAuthResponse } } = await api.post(
        "/auth/signup",
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
        case "USER_NOT_FOUND":
          setErrorMessage("Mauvais identifiants");
        case "MAIL_USED":
          setErrorMessage("L'adresse mail est déjà utilisée.");
        default:
          setErrorMessage("Une erreur est survenue.")
      }
    }
  };

  return (
    <div className="SignUp-Page">
      <form onSubmit={handleSubmit} className="SignUp-Form coloredCorner">
        <Link to={"/"}>
          <div className="BackButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="square" strokeLinejoin={"arcs" as any}><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
          </div>
        </Link>
        <div className="Logo"><img src="./assets/logo_full.png" /></div>
        <h2>Inscription</h2>
        <div className="SignUp-inputs">
          <TextInputComponent
            value={mail}
            modifyValue={setMail}
            label={"Adresse mail"}
            id={"mail"}
          />
          <TextInputComponent
            value={shownName}
            modifyValue={setShownName}
            label={"Pseudo affiché"}
            id={"shownname"}
          />
          <TextInputComponent
            value={password}
            modifyValue={setPassword}
            type="password"
            label={"Mot de passe"}
            id={"password"}
            tooltip={'Au moins 3 caractères'}
          />
          <ButtonComponent label={"S'inscrire"} />
        </div>
        <div
          className="SignUp-errorMessage"
          style={{ ...(errorMessage ? {} : { border: "none" }) }}
        >
          {errorMessage}
        </div>
        <span className="SignUp-toSignIn">
          Déjà inscrit ? <Link to="/login">Connectez-vous</Link>
        </span>
      </form>
    </div>
  );
};
