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
      <div className="content-wrapper">
        <Navbar />
        <Container>{children}</Container>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
