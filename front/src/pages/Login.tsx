import { Button } from "@mui/material";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";



export const Login: React.FC = () => {
    return <div className="Login-Page">
        <div className="Login-Form">
            <Link to="prehome"><Button variant="contained">Connexion</Button></Link>
        </div>
    </div>
};
