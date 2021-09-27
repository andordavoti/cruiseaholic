import { Container } from "@material-ui/core";
import { FC, useRef } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface Props {
  children: JSX.Element;
}

const Layout: FC<Props> = ({ children }) => {
  const navRef = useRef<null | HTMLDivElement>(null);
  const footerRef = useRef<null | HTMLDivElement>(null);
  return (
    <div style={{ minHeight: "100vh" }}>
      <div ref={navRef}>
        <Navbar />
      </div>

      <Container
        style={{
          minHeight: `calc(100vh - ${navRef.current?.clientHeight || 0}px - ${
            footerRef.current?.clientHeight || 0
          }px)`,
        }}
      >
        {children}
      </Container>

      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
