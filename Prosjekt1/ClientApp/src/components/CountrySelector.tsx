import { Typography, useTheme } from "@mui/material";
import { FC } from "react";
import { destinations } from "../lib/destinations";

interface Props {
  title: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const CountrySelector: FC<Props> = ({ title, value, setValue }) => {
  const theme = useTheme();
  return (
    <div>
      <Typography
        variant="h6"
        align="center"
        color="secondary"
        style={{ fontWeight: "normal" }}
      >
        {title}: {value}
      </Typography>

      <div style={{ display: "flex" }}>
        {destinations.map(({ name, flagImg }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "1rem",
            }}
          >
            <img
              src={flagImg}
              alt={name}
              onClick={() => setValue(name)}
              style={{
                cursor: "pointer",
                width: 50,
                height: 50,
                borderRadius: "50%",
              }}
            />

            <div
              style={{
                width: 50,
                height: 8,
                marginTop: 5,
                borderRadius: 10,
                backgroundColor:
                  value === name ? theme.palette.secondary.main : "white",
                transition: "background-color 0.4s",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountrySelector;
