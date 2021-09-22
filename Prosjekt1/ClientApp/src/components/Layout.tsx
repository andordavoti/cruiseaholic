import { Container } from "@mui/material";
import { FC } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout: FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
