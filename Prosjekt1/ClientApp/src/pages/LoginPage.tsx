import {
  Button,
  makeStyles,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { FC, useState } from "react";
import { useHistory } from "react-router";
import { User } from "../../types";
import { toast } from "../App";
import { validateUser } from "../utils/validateForm";

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

const initialFormData: User = {
  username: "",
  password: "",
};

const LoginPage: FC = () => {
  const [formData, setFormData] = useState(initialFormData);

  const theme = useTheme();
  const styles = useStyles();
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateUser(formData)) {
      try {
        const res = await fetch("order/login", {
          method: "post",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const ok = await res.json();

        if (ok) {
          setFormData(initialFormData);
          toast.success("Successfully logged in");
          history.push("/manage-routes");
        } else {
          toast.error("Wrong username or password!");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong, please try again later...");
      }
    }
  };
  return (
    <div className={styles.absoluteCenter}>
      <Typography color="textPrimary" variant="h3">
        Login
      </Typography>

      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
      >
        <TextField
          required
          type="text"
          name="username"
          label="Username"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.username}
          onChange={handleChange}
        />

        <TextField
          required
          type="password"
          name="password"
          label="Password"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{
            color: theme.palette.secondary.main,
            borderRadius: 25,
            marginTop: "1rem",
          }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
