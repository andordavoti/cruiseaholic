import { FC } from "react";
import { Container } from "reactstrap";
import NavMenu from "./NavMenu";

const Layout: FC = ({ children }) => {
  return (
    <div>
      <NavMenu />
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
