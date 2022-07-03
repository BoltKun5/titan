import {Button, InputBase, TextField} from "@mui/material";
import React, {ReactElement, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {ISigninAuthBody, ISigninAuthResponse} from "../../../api/src/local_core/types/types/interface";
import {HttpResponseError} from "../../../api/src/modules/HttpResponseError";
import Joi from "joi";
import {useNavigate} from "react-router-dom";

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

    const result = querySchema.validate({username: username, password: password});

    try {
      const response: { data: { data: ISigninAuthResponse } } = await axios.post("http://localhost:10101/api/auth/signin", {
        ...result.value,
      });
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
      navigate("/prehome");

    } catch (e) {
      const errorCode = e.response?.data?.error?.code;
      switch (errorCode) {
        case "USER_NOT_FOUND":
          setErrorMessage("Mauvais identifiants");
      }
    }
  };

  return <div className="Login-Page">
    <form onSubmit={handleSubmit} className="Login-Form">
      <TextField
        id="username"
        value={username}
        label="Nom de compte"
        onChange={e =>
          setUsername(e.target.value)
        }/>
      <TextField id="password" value={password} label="Mot de passe" onChange={e => setPassword(e.target.value)}/>
      {(errorMessage !== "") && <div>{errorMessage}</div>}
      <Button variant="outlined" type="submit">Se connecter</Button>
    </form>
  </div>
};
