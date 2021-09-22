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
} from "@mui/material";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineInstagram } from "react-icons/ai";
import { MdMailOutline, MdClose } from "react-icons/md";
import { Link as RouteLink } from "react-router-dom";
import { useState } from "react";
import logoImg from "../assets/logo.png";
import { useIsMobile } from "../hooks/useIsMobile";

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useIsMobile();
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

          {isMobile ? (
            <Box>
              <IconButton color="secondary" onClick={() => setDrawerOpen(true)}>
                <HiMenuAlt3 size="2rem" />
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
                      <MdClose
                        color={theme.palette.secondary.main}
                        size="2rem"
                      />
                    </IconButton>
                  </div>

                  <List>
                    <Link target="_blank" rel="noopener noreferrer" href="">
                      <ListItem button>
                        <ListItemIcon>
                          <MdMailOutline
                            color={theme.palette.secondary.main}
                            size="2rem"
                          />
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
                    <RouteLink to="/">
                      <ListItem button>
                        <ListItemText
                          primary="Home"
                          primaryTypographyProps={{ color: "secondary" }}
                        />
                      </ListItem>
                    </RouteLink>

                    <RouteLink to="/producers">
                      <ListItem button>
                        <ListItemText
                          primary="Producers"
                          primaryTypographyProps={{ color: "secondary" }}
                        />
                      </ListItem>
                    </RouteLink>

                    <RouteLink to="/privacy">
                      <ListItem button>
                        <ListItemText
                          primary="Privacy Policy"
                          primaryTypographyProps={{ color: "secondary" }}
                        />
                      </ListItem>
                    </RouteLink>

                    <RouteLink to="/terms">
                      <ListItem button>
                        <ListItemText
                          primary="Terms of Service"
                          primaryTypographyProps={{ color: "secondary" }}
                        />
                      </ListItem>
                    </RouteLink>
                  </List>
                </div>
              </SwipeableDrawer>
            </Box>
          ) : (
            <Box>
              <Link target="_blank" rel="noopener noreferrer" href="">
                <IconButton color="secondary">
                  <MdMailOutline size="2rem" />
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
