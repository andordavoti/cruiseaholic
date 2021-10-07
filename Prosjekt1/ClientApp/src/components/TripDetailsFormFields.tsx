import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import dayjs, { Dayjs } from "dayjs";
import { Dispatch, FC, SetStateAction } from "react";
import DestinationSelector from "./DestinationSelector";
import { FormData } from "../pages/BookingPage";
import { getTotalPrice } from "../utils/getTotalPrice";
import { Route } from "../../types";
import { useIsMobile } from "../hooks/useIsMobile";

interface Props {
  fromDestination: string;
  setFromDestination: Dispatch<SetStateAction<string>>;
  fromDestinationOptions: null | string[];
  toDestination: string;
  setToDestination: Dispatch<SetStateAction<string>>;
  toDestinationOptions: null | string[];
  isRoundtrip: boolean;
  setIsRoundtrip: Dispatch<SetStateAction<boolean>>;
  departureDate: null | Dayjs;
  setDepartureDate: Dispatch<SetStateAction<null | Dayjs>>;
  returnDate: null | Dayjs;
  setReturnDate: Dispatch<SetStateAction<null | Dayjs>>;
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedRoute: Route | undefined;
}

const TripDetailsFormFields: FC<Props> = ({
  fromDestination,
  setFromDestination,
  fromDestinationOptions,
  toDestination,
  setToDestination,
  toDestinationOptions,
  isRoundtrip,
  setIsRoundtrip,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  formData,
  handleChange,
  selectedRoute,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  return (
    <>
      <DestinationSelector
        label="From destination"
        value={fromDestination}
        setValue={setFromDestination}
        options={fromDestinationOptions}
      />

      <DestinationSelector
        label="To destination"
        value={toDestination}
        setValue={setToDestination}
        options={toDestinationOptions}
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
            label="Return date"
            format="DD/MM/YYYY"
            value={returnDate}
            minDate={dayjs()}
            InputAdornmentProps={{ position: "start" }}
            onChange={setReturnDate}
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
          !!selectedRoute
            ? ` (${
                isRoundtrip
                  ? selectedRoute.priceAdults * 2
                  : selectedRoute.priceAdults
              } NOK)`
            : ""
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
          !!selectedRoute
            ? ` (${
                isRoundtrip
                  ? selectedRoute.priceChildren * 2
                  : selectedRoute.priceChildren
              } NOK)`
            : ""
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
          !!selectedRoute
            ? ` (${
                isRoundtrip
                  ? selectedRoute.priceVehicle * 2
                  : selectedRoute.priceVehicle
              } NOK)`
            : ""
        }`}
        variant="outlined"
        color="secondary"
        style={{ margin: "1rem", minWidth: 240 }}
        value={formData.numberOfVehicles}
        onChange={handleChange}
        inputProps={{ min: "0" }}
      />

      {!isMobile && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "1rem",
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
            Continue to payment
          </Button>
        </div>
      )}
    </>
  );
};

export default TripDetailsFormFields;
