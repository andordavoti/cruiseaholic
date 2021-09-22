import { TextField, Typography, Button, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const Booking: FC = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetch("order/newOrder", {
        method: "post",
        body: JSON.stringify({
          formData,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFormData(initialFormData);
      alert("Order was successfully registered!");
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
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
      {/* 
      <input
        type="date"
        id="start"
        name="trip-start"
        value={dayjs().format("YYYY-MM-DD")}
        min={dayjs().format("YYYY-MM-DD")}
        max={dayjs().add(5, "year").format("YYYY-MM-DD")}
      /> */}
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
        <TextField
          id="outlined-basic"
          label="First name"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem" }}
        />

        <TextField
          id="outlined-basic"
          label="Last name"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem" }}
        />

        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem" }}
        />

        <TextField
          id="outlined-basic"
          label="Phone number"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem" }}
        />

        <TextField
          id="outlined-basic"
          label="Number of adults"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem" }}
        />

        <TextField
          id="outlined-basic"
          label="Number of children"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem" }}
        />

        <TextField
          id="outlined-basic"
          label="Number of veichles"
          variant="outlined"
          color="secondary"
          style={{ margin: "1rem" }}
        />
      </div>
      <Button
        variant="contained"
        style={{
          color: theme.palette.secondary.main,
          borderRadius: 25,
          marginBottom: "2rem",
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default Booking;
