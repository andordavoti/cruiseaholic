import {
  AppBar,
  Container,
  IconButton,
  Link,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import { MdMailOutline } from "react-icons/md";
import { Link as RouteLink } from "react-router-dom";
import logoImg from "../assets/logo.png";

const Navbar: React.FC = () => {
  const theme = useTheme();
  return (
    <AppBar
      color="primary"
      position="sticky"
      style={{
        color: theme.palette.primary.main,
        boxShadow: "none",
        padding: "1rem 0",
      }}
    >
      <Toolbar>
        <Container
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            maxHeight: "10vh",
          }}
        >
          <RouteLink to="/">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={logoImg} style={{ width: 50, height: 50 }} alt="logo" />
              <Typography
                variant="h5"
                color="textPrimary"
                style={{
                  marginLeft: "0.5rem",
                }}
              >
                Cruiseaholic
              </Typography>
            </div>
          </RouteLink>

          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:s354356@oslomet.no"
          >
            <IconButton color="secondary">
              <MdMailOutline size="2rem" />
            </IconButton>
          </Link>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
