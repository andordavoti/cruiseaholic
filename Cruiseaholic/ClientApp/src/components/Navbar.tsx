import {
  AppBar,
  Box,
  Container,
  Divider,
  SwipeableDrawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  makeStyles,
} from "@material-ui/core";
import { MailOutline, Close, Menu } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import logoImg from "../assets/logo.png";
import { useIsMobile } from "../hooks/useIsMobile";

const useStyles = makeStyles((theme) => ({
  navItem: {
    display: "flex",
    alignItems: "center",
    marginLeft: "0.5rem",
    marginRight: "1rem",
  },
  activeNav: {
    color: `${theme.palette.secondary.main} !important`,
  },
  inActiveNav: {
    color: "#5590C4",
  },
}));

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useIsMobile();

  const styles = useStyles();
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
          <NavLink to="/">
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
          </NavLink>

          {isMobile ? (
            <Box>
              <IconButton color="secondary" onClick={() => setDrawerOpen(true)}>
                <Menu />
              </IconButton>

              <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onOpen={() => setDrawerOpen(true)}
                onClose={() => setDrawerOpen(false)}
              >
                <div
                  style={{ width: 250, marginLeft: 15 }}
                  onClick={() => setDrawerOpen(false)}
                  onKeyDown={() => setDrawerOpen(false)}
                >
                  <div
                    style={{
                      width: 250,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton
                      style={{ marginTop: 15, marginRight: 15 }}
                      color="secondary"
                    >
                      <Close />
                    </IconButton>
                  </div>

                  <List>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="mailto:contact@cruiseaholic.com"
                    >
                      <ListItem button>
                        <ListItemIcon>
                          <MailOutline />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          primaryTypographyProps={{ color: "secondary" }}
                        />
                      </ListItem>
                    </Link>
                  </List>
                  <Divider />

                  <List>
                    <ListItem>
                      <div className={styles.navItem}>
                        <NavLink
                          exact
                          to="/"
                          className={styles.inActiveNav}
                          activeClassName={styles.activeNav}
                        >
                          <Typography
                            color="inherit"
                            variant="h6"
                            className="navLink"
                            style={{ fontWeight: "normal" }}
                          >
                            Home
                          </Typography>
                        </NavLink>
                      </div>
                    </ListItem>

                    <ListItem>
                      <div className={styles.navItem}>
                        <NavLink
                          exact
                          to="/booking"
                          className={styles.inActiveNav}
                          activeClassName={styles.activeNav}
                        >
                          <Typography
                            color="inherit"
                            variant="h6"
                            className="navLink"
                            style={{ fontWeight: "normal" }}
                          >
                            Booking
                          </Typography>
                        </NavLink>
                      </div>
                    </ListItem>

                    <ListItem>
                      <div className={styles.navItem}>
                        <NavLink
                          to="/my-orders"
                          className={styles.inActiveNav}
                          activeClassName={styles.activeNav}
                        >
                          <Typography
                            color="inherit"
                            variant="h6"
                            className="navLink"
                            style={{ fontWeight: "normal" }}
                          >
                            My orders
                          </Typography>
                        </NavLink>
                      </div>
                    </ListItem>

                    <ListItem>
                      <div className={styles.navItem}>
                        <NavLink
                          to="/manage-routes"
                          className={styles.inActiveNav}
                          activeClassName={styles.activeNav}
                        >
                          <Typography
                            color="inherit"
                            variant="h6"
                            className="navLink"
                            style={{ fontWeight: "normal" }}
                          >
                            Manage Routes
                          </Typography>
                        </NavLink>
                      </div>
                    </ListItem>
                  </List>
                </div>
              </SwipeableDrawer>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              <div className={styles.navItem}>
                <NavLink
                  exact
                  to="/"
                  className={styles.inActiveNav}
                  activeClassName={styles.activeNav}
                >
                  <Typography
                    color="inherit"
                    variant="h6"
                    className="navLink"
                    style={{ fontWeight: "normal" }}
                  >
                    Home
                  </Typography>
                </NavLink>
              </div>

              <div className={styles.navItem}>
                <NavLink
                  exact
                  to="/booking"
                  className={styles.inActiveNav}
                  activeClassName={styles.activeNav}
                >
                  <Typography
                    color="inherit"
                    variant="h6"
                    className="navLink"
                    style={{ fontWeight: "normal" }}
                  >
                    Booking
                  </Typography>
                </NavLink>
              </div>

              <div className={styles.navItem}>
                <NavLink
                  to="/my-orders"
                  className={styles.inActiveNav}
                  activeClassName={styles.activeNav}
                >
                  <Typography
                    color="inherit"
                    variant="h6"
                    className="navLink"
                    style={{ fontWeight: "normal" }}
                  >
                    My orders
                  </Typography>
                </NavLink>
              </div>

              <div className={styles.navItem}>
                <NavLink
                  to="/manage-routes"
                  className={styles.inActiveNav}
                  activeClassName={styles.activeNav}
                >
                  <Typography
                    color="inherit"
                    variant="h6"
                    className="navLink"
                    style={{ fontWeight: "normal" }}
                  >
                    Manage Routes
                  </Typography>
                </NavLink>
              </div>

              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="mailto:contact@cruiseaholic.com"
              >
                <IconButton color="secondary">
                  <MailOutline />
                </IconButton>
              </Link>
            </Box>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
