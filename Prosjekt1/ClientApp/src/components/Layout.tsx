import { Container } from "@material-ui/core";
import { FC } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface Props {
  children: JSX.Element;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
