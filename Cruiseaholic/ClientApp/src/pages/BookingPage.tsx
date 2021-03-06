import { makeStyles, Typography } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import Payment from "payment";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "../App";
import { Focused } from "react-credit-cards";
import { validatePayment, validateTripInfo } from "../utils/validateForm";
import { useHistory } from "react-router-dom";
import { CustomerOrder, Route, TripInfo } from "../../types";
import { getFromDestinations } from "../utils/getFromDestinations";
import MultistepBooking from "../components/MultistepBooking";
import TripDetailsFormFields from "../components/TripDetailsFormFields";
import PaymentFormFields from "../components/PaymentFormFields";
import { useIsMobile } from "../hooks/useIsMobile";
import { useDispatch } from "react-redux";
import { getRoutes, useRoutes } from "../redux/routeSlice";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  numberOfAdults: "1",
  numberOfChildren: "0",
  numberOfVehicles: "0",
};

export type FormData = typeof initialFormData;
export type CreditcardFormData = typeof initialCreditcardData;
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

const useStyles = makeStyles({
  form: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 600,
  },
  formMobile: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 600,
  },
});

const BookingPage: FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const isMobile = useIsMobile();
  const history = useHistory();
  const styles = useStyles();

  const routes = useRoutes();
  const dispatch = useDispatch();

  const expiryRef = useRef<null | HTMLInputElement>(null);

  const [selectedRoute, setSelectedRoute] = useState<undefined | Route>(
    undefined
  );

  const [formData, setFormData] = useState(initialFormData);
  const [creditcardData, setCreditcardData] = useState(initialCreditcardData);

  const [isRoundtrip, setIsRoundtrip] = useState(true);

  const [fromDestination, setFromDestination] = useState("");
  const [toDestination, setToDestination] = useState("");

  const [departureDate, setDepartureDate] = useState<null | Dayjs>(dayjs());
  const [returnDate, setReturnDate] = useState<null | Dayjs>(
    dayjs().add(1, "day")
  );

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
    dispatch(getRoutes());
  }, [dispatch]);

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

  const handleSubmitTripInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: TripInfo = {
      ...formData,
      isRoundtrip,
      fromDestination,
      toDestination,
      departureDate: departureDate?.format("DD/MM/YYYY"),
      returnDate: isRoundtrip ? returnDate?.format("DD/MM/YYYY") : null,
    };

    if (validateTripInfo(data)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: CustomerOrder = {
      ...formData,
      isRoundtrip,
      fromDestination,
      toDestination,
      departureDate: departureDate?.format("DD/MM/YYYY"),
      returnDate: isRoundtrip ? returnDate?.format("DD/MM/YYYY") : null,
      cardNumber: Number(creditcardData.number),
      cardholderName: creditcardData.name,
      cvc: Number(creditcardData.cvc),
      expiry: creditcardData.expiry,
    };

    if (validateTripInfo(data) && validatePayment(data)) {
      try {
        const res = await fetch("order/newOrder", {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const referenceEmail = await res.text();

        setFormData(initialFormData);
        setCreditcardData(initialCreditcardData);
        toast.success("Booking was successfully registered");

        history.push(`/my-orders/${referenceEmail}`);
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong with booking your trip...");
      }
    }
  };

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

      {isMobile ? (
        <form className={styles.formMobile} onSubmit={handleSubmit}>
          <TripDetailsFormFields
            {...{
              fromDestination,
              setFromDestination,
              toDestination,
              setToDestination,
              isRoundtrip,
              setIsRoundtrip,
              departureDate,
              setDepartureDate,
              returnDate,
              setReturnDate,
              formData,
              handleChange,
              selectedRoute,
            }}
            fromDestinationOptions={routes ? getFromDestinations(routes) : null}
            toDestinationOptions={
              routes
                ? routes
                    ?.filter(
                      (route) => route.fromDestination === fromDestination
                    )
                    .map((route) => route.toDestination)
                : null
            }
          />
          <PaymentFormFields
            {...{
              creditcardData,
              handleCreditcardInputChange,
              expiryRef,
              selectedRoute,
              formData,
              isRoundtrip,
            }}
            back={() => setActiveStep((prev) => prev - 1)}
          />
        </form>
      ) : (
        <MultistepBooking
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          tripDetails={
            <form className={styles.form} onSubmit={handleSubmitTripInfo}>
              <TripDetailsFormFields
                {...{
                  fromDestination,
                  setFromDestination,
                  toDestination,
                  setToDestination,
                  isRoundtrip,
                  setIsRoundtrip,
                  departureDate,
                  setDepartureDate,
                  returnDate,
                  setReturnDate,
                  formData,
                  handleChange,
                  selectedRoute,
                }}
                fromDestinationOptions={
                  routes ? getFromDestinations(routes) : null
                }
                toDestinationOptions={
                  routes
                    ? routes
                        ?.filter(
                          (route) => route.fromDestination === fromDestination
                        )
                        .map((route) => route.toDestination)
                    : null
                }
              />
            </form>
          }
          paymentDetails={
            <form onSubmit={handleSubmit} className={styles.form}>
              <PaymentFormFields
                {...{
                  creditcardData,
                  handleCreditcardInputChange,
                  expiryRef,
                  selectedRoute,
                  formData,
                  isRoundtrip,
                }}
                back={() => setActiveStep((prev) => prev - 1)}
              />
            </form>
          }
        />
      )}
    </div>
  );
};

export default BookingPage;
