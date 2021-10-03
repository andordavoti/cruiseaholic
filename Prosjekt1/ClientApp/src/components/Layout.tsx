import { Container } from "@material-ui/core";
import { FC } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface Props {
  children: JSX.Element;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </div>
  );
};

export default Layout;
