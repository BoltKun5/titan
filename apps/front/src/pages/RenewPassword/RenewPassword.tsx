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
import { useSnackbar } from "notistack";

export const RenewPassword: React.FC = () => {
  const [mail, setMail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(StoreContext);
  const { enqueueSnackbar } = useSnackbar();

  const querySchema = Joi.object<ISigninAuthBody>({
    mail: Joi.string().email({ tlds: { allow: false } }).required(),
  });

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();


    const result = querySchema.validate({
      mail,
    });

    if (result.error) {
      enqueueSnackbar(
        "Les informations fournies ne peuvent pas correspondre à un compte."
      );
      return;
    }

    try {
      const response: { data: { data: ISigninAuthResponse } } = await api.post(
        "/auth/renew-password",
        {
          ...result.value,
        }
      );
      setSubmitted(true);
    } catch (e: any) {
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case HttpErrorCode.notFound:
          enqueueSnackbar("Cet e-mail ne correspond à aucun compte.");
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
    <div className="RenewPassword-Page">
      <form onSubmit={handleSubmit} className="RenewPassword-Form coloredCorner">
        <Link to={"/login"}>
          <div className="BackButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="square" strokeLinejoin={"arcs" as any}><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
          </div>
        </Link>

        <div className="Logo">
          <img src="/assets/logo_full_big.png" />
        </div>
        <h2 style={{ fontSize: 24 }}>Réinitialiser le mot de passe</h2>
        {!submitted && <>
          <div className="RenewPassword-inputs">
            <TextInputComponent
              value={mail}
              modifyValue={setMail}
              label={"Adresse mail"}
              id="mail"
            />
          </div>
          <ButtonComponent label="Recevoir un mail" type="submit" disabled={!!querySchema.validate({ mail })?.error} />
        </>}
        {submitted && <>
          <div className="RenewPassword-submitted">Un e-mail contenant un lien de réinitialisation vous a été envoyé.</div>
          <Link to={'/login'}>
            <ButtonComponent label="Retourner à la connexion" size={250} clipPath={13} type="submit" />
          </Link>
        </>
        }
      </form>
    </div>
  );
};
