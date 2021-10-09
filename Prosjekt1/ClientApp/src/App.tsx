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
import MyOrdersPage from "./pages/MyOrdersPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import ManageRoutes from "./pages/ManageRoutes";

export const toast = new Notyf({ duration: 3000 });

const theme = createTheme(themeOptions);

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <Layout>
          <>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/booking" component={BookingPage} />
            <Route exact path="/my-orders/:email?" component={MyOrdersPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/manage-routes" component={ManageRoutes} />
          </>
        </Layout>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
