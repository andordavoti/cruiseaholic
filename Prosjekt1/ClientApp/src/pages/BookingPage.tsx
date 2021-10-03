import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  TextField,
  Typography,
  Button,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import Payment from "payment";
import { FC, useEffect, useRef, useState } from "react";
import DestinationSelector from "../components/DestinationSelector";
import { toast } from "../App";
import Cards, { Focused } from "react-credit-cards";
import { valudateForm } from "../utils/validateForm";
import { Redirect } from "react-router-dom";
import { CustomerOrder, Route } from "../../types";
import { getFromDestinations } from "../utils/getFromDestinations";
import { getTotalPrice } from "../utils/getTotalPrice";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  numberOfAdults: "1",
  numberOfChildren: "0",
  numberOfVehicles: "0",
};

interface CreditcardDataType {
  cvc: "";
  expiry: "";
  focus: undefined | Focused;
  name: "";
  number: "";
}

const initialCreditcardData: CreditcardDataType = {
  cvc: "",
  expiry: "",
  focus: undefined,
  name: "",
  number: "",
};

const BookingPage: FC = () => {
  const theme = useTheme();

  const expiryRef = useRef<null | HTMLInputElement>(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<undefined | Route>(
    undefined
  );

  const [orderReference, setOrderReference] = useState<null | number>(null);

  const [formData, setFormData] = useState(initialFormData);
  const [creditcardData, setCreditcardData] = useState(initialCreditcardData);

  const [isRoundtrip, setIsRoundtrip] = useState(true);

  const [fromDestination, setFromDestination] = useState("");
  const [toDestination, setToDestination] = useState("");

  const [departureDate, setDepartureDate] = useState<null | Dayjs>(dayjs());
  const [arrivalDate, setArrivalDate] = useState<null | Dayjs>(dayjs());

  useEffect(() => {
    if (!routes || !fromDestination?.length || !toDestination?.length) {
      setSelectedRoute(undefined);
    } else if (routes && fromDestination && toDestination) {
      const route = routes.find(
        (r) =>
          r.fromDestination === fromDestination &&
          r.toDestination === toDestination
      );

      setSelectedRoute(route);
    }
  }, [fromDestination, routes, toDestination]);

  useEffect(() => {
    if (expiryRef.current) Payment.formatCardExpiry(expiryRef.current);
  }, [creditcardData.expiry]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("order/getRoutes");

        if (res.status === 200) {
          const data = await res.json();
          setRoutes(data);
        } else {
          toast.error("Something went wrong getting available routes");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong getting available routes");
      }
    };

    fetchRoutes();
  }, []);

  const handleCreditcardInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setCreditcardData((prev) => ({
      ...prev,
      [name]: value,
      focus: name as undefined | Focused,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: CustomerOrder = {
      ...formData,
      isRoundtrip,
      fromDestination,
      toDestination,
      departureDate: departureDate?.format("DD/MM/YYYY"),
      arrivalDate: isRoundtrip ? arrivalDate?.format("DD/MM/YYYY") : null,
      cardNumber: Number(creditcardData.number),
      cardholderName: creditcardData.name,
      cvc: Number(creditcardData.cvc),
      expiry: creditcardData.expiry,
    };

    console.log("data: ", data);

    if (valudateForm(data)) {
      try {
        const res = await fetch("order/newOrder", {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 200) {
          const referenceNumber = await res.json();
          setFormData(initialFormData);
          setCreditcardData(initialCreditcardData);
          toast.success("Booking was successfully registered");

          setOrderReference(referenceNumber);
        } else {
          toast.error("Something went wrong with booking your trip...");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong with booking your trip...");
      }
    }
  };

  if (orderReference) {
    return <Redirect to={`/my-orders/${orderReference}`} />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "2rem",
      }}
    >
      <Typography color="textPrimary" variant="h3">
        Booking
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100vw",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 600,
          margin: "2rem",
        }}
      >
        <DestinationSelector
          label="From destination"
          value={fromDestination}
          setValue={setFromDestination}
          options={routes ? getFromDestinations(routes) : null}
        />

        <DestinationSelector
          label="To destination"
          value={toDestination}
          setValue={setToDestination}
          options={
            routes
              ? routes
                  ?.filter((route) => route.fromDestination === fromDestination)
                  .map((route) => route.toDestination)
              : null
          }
        />

        <div
          style={{
            display: "flex",
            width: "100vw",
            justifyContent: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                color="secondary"
                value={isRoundtrip}
                onChange={(_, checked) => setIsRoundtrip(checked)}
              />
            }
            label="Roundtrip"
            style={{ margin: "1rem" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100vw",
            justifyContent: "center",
          }}
        >
          <KeyboardDatePicker
            autoOk
            color="secondary"
            variant="inline"
            inputVariant="outlined"
            label="Departure date"
            format="DD/MM/YYYY"
            value={departureDate}
            minDate={dayjs()}
            InputAdornmentProps={{ position: "start" }}
            onChange={setDepartureDate}
            style={{ margin: "1rem", minWidth: 240 }}
          />

          {isRoundtrip && (
            <KeyboardDatePicker
              autoOk
              color="secondary"
              variant="inline"
              inputVariant="outlined"
              label="Arrival date"
              format="DD/MM/YYYY"
              value={arrivalDate}
              minDate={dayjs()}
              InputAdornmentProps={{ position: "start" }}
              onChange={setArrivalDate}
              style={{ margin: "1rem", minWidth: 240 }}
            />
          )}
        </div>

        <TextField
          required
          name="firstName"
          type="text"
          label="First name"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextField
          required
          type="text"
          name="lastName"
          label="Last name"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextField
          required
          name="email"
          type="email"
          label="Email"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          required
          name="phoneNumber"
          type="text"
          label="Phone number"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <TextField
          required
          name="numberOfAdults"
          type="number"
          label={`Number of adults${
            !!selectedRoute &&
            ` (${
              isRoundtrip
                ? selectedRoute.priceAdults * 2
                : selectedRoute.priceAdults
            } NOK)`
          }`}
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.numberOfAdults}
          onChange={handleChange}
          inputProps={{ min: "0" }}
        />
        <TextField
          required
          name="numberOfChildren"
          type="number"
          label={`Number of children${
            !!selectedRoute &&
            ` (${
              isRoundtrip
                ? selectedRoute.priceChildren * 2
                : selectedRoute.priceChildren
            } NOK)`
          }`}
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.numberOfChildren}
          onChange={handleChange}
          inputProps={{ min: "0" }}
        />
        <TextField
          required
          name="numberOfVehicles"
          type="number"
          label={`Number of vehicles${
            !!selectedRoute &&
            ` (${
              isRoundtrip
                ? selectedRoute.priceVehicle * 2
                : selectedRoute.priceVehicle
            } NOK)`
          }`}
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={formData.numberOfVehicles}
          onChange={handleChange}
          inputProps={{ min: "0" }}
        />

        <div
          style={{
            display: "flex",
            width: "100vw",
            justifyContent: "center",
            margin: "1rem",
          }}
        >
          <Cards
            cvc={creditcardData.cvc}
            expiry={creditcardData.expiry}
            focused={creditcardData.focus}
            name={creditcardData.name}
            number={creditcardData.number}
          />
        </div>

        <TextField
          required
          name="number"
          type="number"
          label="Card Number"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={creditcardData.number}
          onChange={handleCreditcardInputChange}
        />

        <TextField
          required
          name="name"
          type="text"
          label="Cardholder Name"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={creditcardData.name}
          onChange={handleCreditcardInputChange}
        />

        <TextField
          required
          name="cvc"
          type="number"
          label="CVC"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={creditcardData.cvc}
          onChange={handleCreditcardInputChange}
        />

        <TextField
          ref={expiryRef}
          required
          name="expiry"
          type="text"
          label="Expiry (MM/YY)"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem", minWidth: 240 }}
          value={creditcardData.expiry.replaceAll(" ", "")}
          onChange={handleCreditcardInputChange}
        />

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <Typography color="textPrimary" variant="h6" align="center">
            Total price:
            <Typography
              color="textPrimary"
              variant="h6"
              style={{ fontWeight: "normal", marginLeft: "0.5rem" }}
            >
              {getTotalPrice(
                selectedRoute,
                formData.numberOfAdults,
                formData.numberOfChildren,
                formData.numberOfVehicles,
                isRoundtrip
              )}
            </Typography>
          </Typography>

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
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingPage;
