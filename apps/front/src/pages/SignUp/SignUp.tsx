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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shownName, setShownName] = useState("");
  const navigate = useNavigate();

  const {setUser} = useContext(StoreContext)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const querySchema = Joi.object<ISignupAuthBody>({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string().min(5).max(30).required(),
      shownName: Joi.string().min(3).max(30).required(),
    });

    const result = querySchema.validate({
      username: username,
      password: password,
      shownName: shownName,
    });

    if (result.error) {
      setErrorMessage("Les formats ne sont pas respectés.");
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
      }
    }
  };

  return (
    <div className="SignUp-Page">
      <form onSubmit={handleSubmit} className="SignUp-Form coloredCorner">
        <h2>Inscription</h2>
        <div className="SignUp-inputs">
          <TextInputComponent
            value={username}
            modifyValue={setUsername}
            label={"Nom de compte"}
            id={"username"}
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
          />
          <ButtonComponent label={"S'inscrire"} />
        </div>
        <div
          className="Login-errorMessage"
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
