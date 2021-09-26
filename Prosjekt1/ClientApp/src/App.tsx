import { FC } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { Route } from "react-router";
import Layout from "./components/Layout";
import DayjsUtils from "@date-io/dayjs";

import "./custom.css";
import { themeOptions } from "./lib/themeOptions";
import HomePage from "./pages/HomePage";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import "react-credit-cards/es/styles-compiled.css";

export const toast = new Notyf();

const theme = createTheme(themeOptions);

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <Layout>
          <Route exact path="/" component={HomePage} />
        </Layout>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
