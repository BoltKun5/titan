import React, { useCallback, useContext, useEffect, useState } from "react";
import { CardManagerFilterComponent } from "../../components/CardManagerFilterComponent/CardManagerFilterComponent";
import { CardManagerCardListComponent } from "../../components/CardManagerCardListComponent/CardManagerCardListComponent";
import "./style.scss";
import StoreContext from "../../hook/contexts/StoreContext";
import { useFetchData } from "../../hook/api/cards";
import { Loader } from "../../components/UI/Loader/LoaderComponent";
import {
  getFilterQuery,
  isUnloggedPage,
  isUserConnected,
} from "../../general.utils";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../axios";
import { IGetPreSignedResponse, IPreSignedUrl, IResponse, ISigninAuthResponse, PreSignedTypeEnum } from "vokit_core";
import { AxiosResponse } from "axios";
import { TextInputComponent } from "../../components/UI/TextInputComponent/TextInputComponent";
import { ButtonComponent } from "../../components/UI/Button/ButtonComponent";
import Joi from "joi";
import { useSnackbar } from "notistack";

export const PreSigned: React.FC = () => {
  const [data, setData] = useState<null | Record<string, any> | "error">(null);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [searchParams] = useSearchParams();
  const { user, setUser } = useContext(StoreContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  let token: string | null = searchParams.get('token');

  const querySchema = Joi.object({
    password: Joi.string().min(5).required(),
    passwordValidation: Joi.string().equal(password).required(),
  });

  const fetchPreSigned = useCallback(async () => {
    if (!token) return;
    try {
      const response: AxiosResponse<IResponse<IGetPreSignedResponse>> = await api.get(`/pre-signed?token=${token}`);
      if (response.data.data.type === PreSignedTypeEnum.CREATE_ACCOUNT) {
        const _data = response.data.data.data as ISigninAuthResponse
        localStorage.setItem("token", _data.token);
        localStorage.setItem("user", JSON.stringify(_data.user));
        setUser(_data.user);
        navigate("/");
      }
      if (response.data.data.type === PreSignedTypeEnum.RENEW_PASSWORD) {
        setData(response.data.data)
      }
    } catch (e) {
      setData("error")
    }
  }, []);

  useEffect(() => {
    fetchPreSigned();
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const result = querySchema.validate({
      password,
      passwordValidation
    });

    if (result.error) {
      ("Les données ne sont pas valides.");
      return;
    }

    try {
      await api.post(
        "/pre-signed/update-password",
        {
          password,
          token
        }
      );
      setSubmitted(true)
    } catch (e: any) {
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case "USER_NOT_FOUND":
          enqueueSnackbar("Mauvais identifiants");
        case "MAIL_USED":
          enqueueSnackbar("L'adresse mail est déjà utilisée.");
        default:
          enqueueSnackbar("Une erreur est survenue.")
      }
    }
  };


  if (!token) {
    return <div className="PreSigned-error">
      <span>
        Ce lien n'est pas valide. Il a peut être expiré.
      </span>
    </div>
  }

  if (!data) {
    return <Loader />;
  }

  if (data === "error") {
    return <div className="PreSigned-error">
      <span>
        Ce lien n'est pas valide. Il a peut être expiré.
      </span>
    </div>
  }

  if (data?.type === PreSignedTypeEnum.RENEW_PASSWORD) {
    return <div className="PreSigned-renewPassword">
      <form onSubmit={handleSubmit} className="PreSigned-Form coloredCorner">
        <div className="Logo">
          <img src="/assets/logo_full_big.png" />
        </div>
        <h2 style={{ fontSize: 24 }}>Définir un nouveau mot de passe</h2>
        {!submitted && <>
          <div className="PreSigned-inputs">
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
          </div>
          <ButtonComponent label="Valider" type="submit" disabled={!!querySchema.validate({ password, passwordValidation })?.error} />
          <div style={{ height: 20 }} />
        </>}
        {submitted && <>
          <div className="PreSigned-submitted">Votre mot de passe a été modifié.</div>
          <Link to={'/login'}>
            <ButtonComponent label="Retourner à la connexion" size={250} clipPath={13} type="submit" />
          </Link>
        </>
        }
      </form>
    </div>
  }

  return (
    <></>
  );
};
