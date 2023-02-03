import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { DismissNotification } from "./components/DismissNotification";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={3}
        action={(snackbarId) => <DismissNotification id={snackbarId} />}
      >
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </React.Fragment>
);
