import { Icon } from "@mui/material";
import { SnackbarKey, useSnackbar } from "notistack";
import React, { Fragment, useContext } from "react";
import "./style.scss";
import CloseIcon from "@mui/icons-material/Close";

export const DismissNotification: React.FC<{ id: SnackbarKey }> = ({ id }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <div onClick={() => closeSnackbar(id)} style={{ alignItems: 'center', display: 'flex' }}>
      <CloseIcon style={{ cursor: 'pointer' }} />
    </div>
  );
};
