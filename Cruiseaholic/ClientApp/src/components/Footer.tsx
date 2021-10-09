import { FC } from "react";
import { Typography, useTheme } from "@material-ui/core";

const Footer: FC = () => {
  const theme = useTheme();
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: theme.palette.primary.main,
        padding: "2rem 0.5rem",
        flexShrink: 0,
      }}
    >
      <Typography
        variant="h6"
        color="textPrimary"
        align="center"
        style={{ fontWeight: "normal" }}
      >
        © {new Date().getFullYear()} Cruiseaholic
      </Typography>
    </footer>
  );
};

export default Footer;
