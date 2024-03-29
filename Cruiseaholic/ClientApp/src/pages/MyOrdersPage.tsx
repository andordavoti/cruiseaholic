import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { Redirect, RouteComponentProps, useHistory } from "react-router-dom";
import { CustomerInfo } from "../../types";
import { toast } from "../App";
import OrderCard from "../components/OrderCard";
import ReferenceField from "../components/ReferenceField";

interface MatchParams {
  email?: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

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

const MyOrdersPage: FC<Props> = ({
  match: {
    params: { email },
  },
}) => {
  const theme = useTheme();

  const history = useHistory();

  const [order, setOrder] = useState<null | CustomerInfo>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  const [customerEmail, setCustomerEmail] = useState(email);
  const [emailInput, setEmailInput] = useState("");

  const styles = useStyles();

  useEffect(() => {
    const getCustomerInfo = async () => {
      try {
        setOrderLoading(true);
        const res = await fetch(`order/getCustomerInfo?email=${customerEmail}`);
        setOrderLoading(false);

        if (res.status === 200) {
          const data = await res.json();
          setOrder(data);
        } else if (res.status === 404) {
          setOrder(null);
        }
      } catch (err) {
        console.log(err);
        setOrder(null);
        toast.error(`Could not get orders for ${customerEmail}`);
      }
    };

    if (customerEmail !== undefined) getCustomerInfo();
  }, [customerEmail]);

  const renderOrder = () => {
    if (!order && !orderLoading) {
      return (
        <div className={styles.absoluteCenter}>
          <Typography
            color="textPrimary"
            variant="h6"
            align="center"
            style={{ fontWeight: "normal", marginBottom: "1rem" }}
          >
            No orders found for email: {customerEmail}
          </Typography>

          <Button
            onClick={() => {
              setCustomerEmail(undefined);
              history.push("/my-orders");
            }}
            variant="contained"
            color="primary"
            style={{
              color: theme.palette.secondary.main,
              borderRadius: 25,
            }}
          >
            Try a different email
          </Button>
        </div>
      );
    } else if (order && !orderLoading) {
      const { firstName, lastName, email, phoneNumber, orders } = order;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            color="textPrimary"
            variant="h4"
            style={{ marginBottom: "1rem" }}
          >
            Contact info
          </Typography>

          <ReferenceField field="Name" value={`${firstName} ${lastName}`} />
          <ReferenceField field="Email" value={email} />
          <ReferenceField field="Phone number" value={phoneNumber} isLast />

          <Typography
            color="textPrimary"
            variant="h4"
            style={{ marginTop: "2rem" }}
          >
            Orders
          </Typography>
          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}

          <Button
            onClick={() => {
              setOrder(null);
              setCustomerEmail(undefined);
              history.push("/my-orders");
            }}
            variant="contained"
            color="primary"
            style={{
              color: theme.palette.secondary.main,
              borderRadius: 25,
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            Orders for a different email
          </Button>
        </div>
      );
    }
  };

  if (email === undefined && customerEmail !== undefined) {
    return <Redirect to={`/my-orders/${customerEmail}`} />;
  }

  if (customerEmail !== undefined && orderLoading) {
    return (
      <div className={styles.absoluteCenter}>
        <CircularProgress color="secondary" />
        <Typography
          color="textPrimary"
          variant="h6"
          align="center"
          style={{ fontWeight: "normal", marginTop: "1rem" }}
        >
          Looking for order...
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "2rem",
      }}
    >
      <Typography color="textPrimary" variant="h3">
        My orders
      </Typography>

      <Box m="1.5rem" />

      {customerEmail === undefined ? (
        <>
          <Typography
            color="textPrimary"
            variant="h6"
            align="center"
            style={{ fontWeight: "normal" }}
          >
            Please enter you email below
          </Typography>

          <TextField
            required
            name="emailInput"
            type="email"
            label="Email"
            variant="outlined"
            color="secondary"
            style={{ margin: "1rem" }}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            inputProps={{ min: "0" }}
          />

          <Button
            onClick={() => {
              if (
                /^[A-Za-zæøåÆØÅ0-9_\-,\. ]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(
                  emailInput
                )
              ) {
                setCustomerEmail(emailInput);
              } else {
                toast.error("Email is not valid!");
              }
            }}
            variant="contained"
            color="primary"
            style={{
              color: theme.palette.secondary.main,
              borderRadius: 25,
              marginBottom: "2rem",
            }}
          >
            Submit
          </Button>
        </>
      ) : (
        renderOrder()
      )}
    </div>
  );
};

export default MyOrdersPage;
