import { FC } from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";

import "./custom.css";
import NewOrder from "./components/NewOrder";
import Orders from "./components/Orders";

const App: FC = () => {
  return (
    <Layout>
      <Route exact path="/" component={Orders} />
      <Route path="/new-order" component={NewOrder} />
    </Layout>
  );
};

export default App;
