import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
// import { useIsMobile } from "../hooks/useIsMobile";

// TODO: clean this up
const Footer: React.FC = () => {
  const theme = useTheme();
  // const isMobile = useIsMobile();

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
      {/* {!isMobile && (
        <Link to="/privacy">
          <Button
            color="secondary"
            variant="outlined"
            style={{ borderRadius: 20 }}
          >
            Privacy Policy
          </Button>
        </Link>
      )} */}

      <Typography
        variant="h6"
        color="textPrimary"
        align="center"
        style={{ fontWeight: "normal" }}
      >
        © {new Date().getFullYear()} Cruiseaholic
      </Typography>

      {/* {!isMobile && (
        <Link to="/terms">
          <Button
            color="secondary"
            variant="outlined"
            style={{ borderRadius: 20 }}
          >
            Terms of Service
          </Button>
        </Link>
      )} */}
    </Box>
  );
};

export default Footer;
