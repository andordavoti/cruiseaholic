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
import { Redirect, RouteComponentProps } from "react-router-dom";
import { toast } from "../App";
import ReferenceField from "../components/ReferenceField";
import { ORDER_REFERENCE, ORDER_REFERENCE_NO_REFERENCE } from "../lib/navPaths";
import { CustomerOrder } from "../types/Order";

interface MatchParams {
  id?: string;
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

const OrderReferencePage: FC<Props> = ({
  match: {
    params: { id },
  },
}) => {
  const theme = useTheme();

  const [order, setOrder] = useState<null | CustomerOrder>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  const [referenceId, setReferenceId] = useState(id);
  const [referenceInput, setReferenceInput] = useState("");

  const styles = useStyles();

  useEffect(() => {
    const getOrderByReferenceId = async () => {
      try {
        setOrderLoading(true);
        const res = await fetch(`order/getOrderById?id=${referenceId}`);
        setOrderLoading(false);

        if (res.status === 200) {
          const data = await res.json();
          setOrder(data);
        } else {
          setOrder(null);
          toast.error(`Could not get order for reference id ${referenceId}`);
        }
      } catch (err) {
        console.log(err);
        setOrder(null);
        toast.error(`Could not get order for reference id ${referenceId}`);
      }
    };

    if (referenceId !== ORDER_REFERENCE_NO_REFERENCE) getOrderByReferenceId();
  }, [referenceId]);

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
            No order found for reference number {referenceId}
          </Typography>

          <Button
            onClick={() => setReferenceId(ORDER_REFERENCE_NO_REFERENCE)}
            variant="contained"
            color="primary"
            style={{
              color: theme.palette.secondary.main,
              borderRadius: 25,
            }}
          >
            Try again
          </Button>
        </div>
      );
    } else if (order && !orderLoading) {
      const {
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        fromDestination,
        toDestination,
        departureDate,
        arrivalDate,
        numberOfAdults,
        numberOfChildren,
        numberOfVehicles,
      } = order;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!!id && (
            <ReferenceField field="Reference ID" value={id.toString()} />
          )}
          <ReferenceField field="Name" value={`${firstName} ${lastName}`} />
          <ReferenceField field="Email" value={email} />
          <ReferenceField field="Phone number" value={phoneNumber} />
          <ReferenceField field="From destination" value={fromDestination} />
          <ReferenceField field="To destination" value={toDestination} />
          {!!departureDate && (
            <ReferenceField field="Departure date" value={departureDate} />
          )}
          {!!arrivalDate && (
            <ReferenceField field="Arrival date" value={arrivalDate} />
          )}
          <ReferenceField field="Adults" value={numberOfAdults} />
          <ReferenceField field="Children" value={numberOfChildren} />
          <ReferenceField field="Vehicles" value={numberOfVehicles} isLast />

          <Button
            onClick={() => {
              setOrder(null);
              setReferenceId(ORDER_REFERENCE_NO_REFERENCE);
            }}
            variant="contained"
            color="primary"
            style={{
              color: theme.palette.secondary.main,
              borderRadius: 25,
              marginTop: "1rem",
            }}
          >
            Look up a different order
          </Button>
        </div>
      );
    }
  };

  if (
    id === ORDER_REFERENCE_NO_REFERENCE &&
    referenceId !== ORDER_REFERENCE_NO_REFERENCE
  ) {
    return <Redirect to={`/${ORDER_REFERENCE}/${referenceId}`} />;
  }

  if (referenceId !== ORDER_REFERENCE_NO_REFERENCE && orderLoading) {
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
        Order reference
      </Typography>

      <Box m="1.5rem" />

      {referenceId === ORDER_REFERENCE_NO_REFERENCE ? (
        <>
          <Typography
            color="textPrimary"
            variant="h6"
            align="center"
            style={{ fontWeight: "normal" }}
          >
            Please enter you reference number below
          </Typography>

          <TextField
            required
            name="referenceInput"
            type="number"
            label="Reference number"
            variant="outlined"
            color="secondary"
            style={{ margin: "1rem" }}
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value)}
            inputProps={{ min: "0" }}
          />

          <Button
            onClick={() => {
              if (referenceInput.length) {
                setReferenceId(referenceInput);
              } else {
                toast.error("Reference number cannot be empty");
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

export default OrderReferencePage;
