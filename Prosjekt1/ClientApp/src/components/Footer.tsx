import { FC } from "react";
import { Box, Typography, useTheme } from "@material-ui/core";

const Footer: FC = () => {
  const theme = useTheme();

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: theme.palette.primary.main,
        padding: "2rem 0.5rem",
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
    </Box>
  );
};

export default Footer;
