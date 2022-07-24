import React from 'react';
import './App.css';
import {GlobalRouter} from "./pages/GlobalRouter";
import {createTheme, ThemeProvider} from "@mui/material";
import {blue, red} from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
  },
});

export const App: React.FC = () => {
  return <ThemeProvider theme={darkTheme}><GlobalRouter/></ThemeProvider>
}
