import { FC, useEffect, useState } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { toast } from "../App";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  absoluteCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "grid",
    placeItems: "center",
  },
});

const ManageRoutes: FC = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const styles = useStyles();

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

  if (isLoading) {
    return (
      <div className={styles.absoluteCenter}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return <div>manage-routes</div>;
};

export default ManageRoutes;
