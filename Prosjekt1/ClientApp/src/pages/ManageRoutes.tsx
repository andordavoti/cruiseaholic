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
import { Route } from "../../types";
import { Delete, Edit } from "@material-ui/icons";

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

const ManageRoutes: FC = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState<Route[]>([]);

  const theme = useTheme();
  const styles = useStyles();

  const logOut = async () => {
    await fetch("order/logOut");
    history.push("/login");
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("order/authorizeUser");
        if (res.status === 401) {
          history.push("/login");
          toast.error(
            "You are not logged in, you need to log in to manage routes"
          );
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong, try again later...");
      }
    };

    init();
  }, [history]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("order/getRoutes");
        const data = await res.json();
        setRoutes(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong getting available routes");
      }
    };

    fetchRoutes();
  }, []);

  if (isLoading) {
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
            {routes.map(
              (
                {
                  fromDestination,
                  toDestination,
                  priceAdults,
                  priceChildren,
                  priceVehicle,
                },
                index
              ) => (
                <TableRow key={index}>
                  <TableCell>{fromDestination}</TableCell>
                  <TableCell>{toDestination}</TableCell>
                  <TableCell align="right">{priceAdults}</TableCell>
                  <TableCell align="right">{priceChildren}</TableCell>
                  <TableCell align="right">{priceVehicle}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      style={{ color: "#F28300" }}
                      // TODO: implement this
                      onClick={() => true}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      style={{
                        color: "#B22222",
                      }}
                      // TODO: implement this
                      onClick={() => true}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={styles.btnContainer}>
        <Button
          // TODO: implement this
          onClick={() => true}
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
    </div>
  );
};

export default ManageRoutes;
