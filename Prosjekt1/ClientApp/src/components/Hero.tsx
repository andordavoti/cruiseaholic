import { FC } from "react";
import { useTheme, Typography, Button, Box } from "@material-ui/core";
import { useIsMobile } from "../hooks/useIsMobile";
import heroImg from "../assets/hero.jpg";
import { Link } from "react-router-dom";

const Hero: FC = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingTop: "2rem",
      }}
    >
      <div
        style={{
          width: isMobile ? "85%" : "40%",
          margin: 10,
          marginRight: isMobile ? 10 : 50,
          marginTop: 0,
        }}
      >
        <Typography
          color="textPrimary"
          variant="h3"
          align={isMobile ? "center" : "left"}
        >
          A sea of options
        </Typography>

        <Box m="2rem" />

        <Typography
          color="textPrimary"
          variant="h6"
          align={isMobile ? "center" : "left"}
          style={{ fontWeight: "normal" }}
        >
          Book your next, well deserved vacation, with us.
        </Typography>

        <Box m="2rem" />

        <Link to="/booking">
          <Button
            variant="contained"
            color="primary"
            style={{
              color: theme.palette.secondary.main,
              borderRadius: 25,
              display: isMobile ? "block" : undefined,
              marginLeft: isMobile ? "auto" : undefined,
              marginRight: isMobile ? "auto" : undefined,
            }}
          >
            Book cruise
          </Button>
        </Link>
      </div>
      <img
        style={{
          width: 350,
          height: 350,
          maxWidth: "80vw",
          maxHeight: "80vw",
          borderRadius: "50%",
          borderColor: theme.palette.text.primary,
          margin: isMobile ? "2rem" : undefined,
        }}
        src={heroImg}
        alt=""
      />
    </div>
  );
};

export default Hero;
