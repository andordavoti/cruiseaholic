import {
  TextField,
  Typography,
  Button,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { FC, useState } from "react";
import CountrySelector from "./CountrySelector";

const Booking: FC = () => {
  const theme = useTheme();

  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfVeichles: 0,
    departureDate: new Date(),
    arrivalDate: new Date(),
    isRoundTrip: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [fromDestination, setFromDestination] = useState("Oslo, Norway");
  const [toDestination, setToDestination] = useState("Strømstad, Sweden");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // try {
    //   await fetch("order/newOrder", {
    //     method: "post",
    //     body: JSON.stringify({
    //       formData,
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   setFormData(initialFormData);
    //   alert("Order was successfully registered!");
    // } catch (err) {
    //   console.log(err);
    //   alert("Something went wrong!");
    // }
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

      {/* 
      <input
        type="date"
        id="start"
        name="trip-start"
        value={dayjs().format("YYYY-MM-DD")}
        min={dayjs().format("YYYY-MM-DD")}
        max={dayjs().add(5, "year").format("YYYY-MM-DD")}
      /> */}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: 500,
            margin: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CountrySelector
              title="From"
              value={fromDestination}
              setValue={setFromDestination}
            />

            <CountrySelector
              title="To"
              value={toDestination}
              setValue={setToDestination}
            />

            <FormControlLabel
              control={<Checkbox defaultChecked color="secondary" />}
              label="Roundtrip"
              style={{ margin: "1rem" }}
            />
          </div>

          <TextField
            id="outlined-basic"
            label="First name"
            variant="filled"
            color="secondary"
            style={{ margin: "1rem" }}
          />

          <TextField
            id="outlined-basic"
            label="Last name"
            variant="filled"
            color="secondary"
            style={{ margin: "1rem" }}
          />

          <TextField
            id="outlined-basic"
            label="Email"
            variant="filled"
            color="secondary"
            style={{ margin: "1rem" }}
          />

          <TextField
            id="outlined-basic"
            label="Phone number"
            variant="filled"
            color="secondary"
            style={{ margin: "1rem" }}
          />

          <TextField
            id="outlined-basic"
            label="Number of adults"
            variant="filled"
            color="secondary"
            style={{ margin: "1rem" }}
          />

          <TextField
            id="outlined-basic"
            label="Number of children"
            variant="filled"
            color="secondary"
            style={{ margin: "1rem" }}
          />

          <TextField
            id="outlined-basic"
            label="Number of veichles"
            variant="filled"
            color="secondary"
            style={{ margin: "1rem" }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          style={{
            color: theme.palette.secondary.main,
            borderRadius: 25,
            marginBottom: "2rem",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Booking;
