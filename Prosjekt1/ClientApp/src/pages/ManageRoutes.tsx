import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  makeStyles,
  TableContainer,
  Typography,
  Button,
  useTheme,
  IconButton,
} from "@material-ui/core";
import { toast } from "../App";
import { useHistory } from "react-router-dom";
import { Delete, Edit } from "@material-ui/icons";
import ManageRouteModal from "../components/ManageRouteModal";
import {
  getRoutes,
  removeRoute,
  useRoutes,
  useRoutesLoading,
} from "../redux/routeSlice";
import { useDispatch } from "react-redux";
import { Route } from "../../types";

const useStyles = makeStyles({
  absoluteCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "grid",
    placeItems: "center",
  },
  btnContainer: { display: "block", marginLeft: "auto", marginRight: "auto" },
});

export type ModalType = "ADD" | "EDIT";

const ManageRoutes: FC = () => {
  const history = useHistory();
  const [modalType, setModalType] = useState<ModalType>("ADD");
  const [activeEditRoute, setActiveEditRoute] = useState<null | Route>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const routes = useRoutes();
  const routesLoading = useRoutesLoading();

  const dispatch = useDispatch();

  const theme = useTheme();
  const styles = useStyles();

  const logOut = async () => {
    await fetch("order/logOut");
    history.push("/login");
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("order/authorizeUser");
        if (res.status === 401) {
          history.push("/login");
          toast.error(
            "You are not logged in, you need to log in to manage routes"
          );
        }
        setAuthLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong, try again later...");
      }
    };

    init();
  }, [history]);

  useEffect(() => {
    dispatch(getRoutes());
  }, [dispatch]);

  if (authLoading || routesLoading) {
    return (
      <div className={styles.absoluteCenter}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1rem",
      }}
    >
      <Typography
        color="textPrimary"
        variant="h3"
        align="center"
        style={{ paddingBottom: "2rem" }}
      >
        Manage Routes
      </Typography>

      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>From Destination</TableCell>
              <TableCell>To Destination</TableCell>
              <TableCell align="right">Price Adults (NOK)</TableCell>
              <TableCell align="right">Price Children (NOK)</TableCell>
              <TableCell align="right">Price Vehicle (NOK)</TableCell>
              <TableCell align="right">Edit</TableCell>
              <TableCell align="right">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes?.map((route, index) => (
              <TableRow key={index}>
                <TableCell>{route.fromDestination}</TableCell>
                <TableCell>{route.toDestination}</TableCell>
                <TableCell align="right">{route.priceAdults}</TableCell>
                <TableCell align="right">{route.priceChildren}</TableCell>
                <TableCell align="right">{route.priceVehicle}</TableCell>
                <TableCell align="right">
                  <IconButton
                    style={{ color: "#F28300" }}
                    onClick={() => {
                      setModalType("EDIT");
                      setActiveEditRoute(route);
                      setModalVisible(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    style={{
                      color: "#B22222",
                    }}
                    onClick={() => dispatch(removeRoute(route.id))}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={styles.btnContainer}>
        <Button
          onClick={() => {
            setModalType("ADD");
            setModalVisible(true);
          }}
          variant="contained"
          color="primary"
          style={{
            color: theme.palette.secondary.main,
            borderRadius: 25,
            marginTop: "2rem",
          }}
        >
          Add Route
        </Button>
      </div>

      <div className={styles.btnContainer}>
        <Button
          onClick={logOut}
          variant="contained"
          color="secondary"
          style={{
            borderRadius: 25,
            marginTop: "2rem",
          }}
        >
          Logout
        </Button>
      </div>

      <ManageRouteModal
        type={modalType}
        open={modalVisible}
        editRoute={activeEditRoute}
        onClose={() => {
          setModalVisible(false);
          setActiveEditRoute(null);
        }}
      />
    </div>
  );
};

export default ManageRoutes;
