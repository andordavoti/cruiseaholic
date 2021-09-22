import { FC } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { Route } from "react-router";
import Layout from "./components/Layout";

import "./custom.css";
import { themeOptions } from "./lib/themeOptions";
import HomePage from "./pages/HomePage";

const theme = createTheme(themeOptions);

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Route exact path="/" component={HomePage} />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
