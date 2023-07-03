import React, { useContext, useState } from "react";
import Joi from "joi";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { api } from "../../axios";
import { TextInputComponent } from "../../components/UI/TextInputComponent/TextInputComponent";
import { ButtonComponent } from "../../components/UI/Button/ButtonComponent";
import { ISignupAuthBody, ISigninAuthResponse, IRenewPasswordBody } from "vokit_core";
import StoreContext from "../../hook/contexts/StoreContext";
import { useSnackbar } from "notistack";

export const SignUp: React.FC = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [shownName, setShownName] = useState("");
  const [validation, setValidation] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const querySchema = Joi.object({
    mail: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(5).required(),
    shownName: Joi.string().min(3).max(30).required(),
    passwordValidation: Joi.string().equal(password).required(),
  });

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const result = querySchema.validate({ mail, password, passwordValidation, shownName });

    if (result.error) {
      enqueueSnackbar("Les données ne sont pas valides.");
      return;
    }

    delete result.value.passwordValidation;

    try {
      await api.post(
        "/auth/signup",
        {
          ...result.value,
        }
      );
      setValidation(true);
    } catch (e: any) {
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case "MAIL_USED":
          enqueueSnackbar("L'adresse mail est déjà utilisée.");
          break;
        default:
          enqueueSnackbar("Une erreur est survenue.")
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
        <div className="Logo"><img src="/assets/logo_full_big.png" /></div>
        <h3>Inscription</h3>
        {!validation && <>
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
              tooltip={'Entre 3 et 30 caractères'}
            />
            <TextInputComponent
              value={password}
              modifyValue={setPassword}
              type="password"
              label={"Mot de passe"}
              id={"password"}
              tooltip={'Au moins 5 caractères'}
            />
            <TextInputComponent
              value={passwordValidation}
              modifyValue={setPasswordValidation}
              type="password"
              label={"Répetez le mot de passe"}
              id={"passwordvalidation"}
            />
            <ButtonComponent label={"S'inscrire"} disabled={!!querySchema.validate({ mail, password, passwordValidation, shownName })?.error} />
          </div>
          <span className="SignUp-toSignIn">
            Déjà inscrit ? <Link to="/login">Connectez-vous</Link>
          </span>
        </>}
        {
          validation && <div className="SignUp-validation">
            Un mail vous a été envoyé contenant un lien pour finaliser la création de votre compte.
          </div>
        }
      </form>
    </div>
  );
};
