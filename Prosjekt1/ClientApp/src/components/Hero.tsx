import { FC } from "react";
import { useTheme, Typography, Button, Box } from "@material-ui/core";
import { useIsMobile } from "../hooks/useIsMobile";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  subText: string;
  btnText: string;
  img: string;
  reverse?: boolean;
}

const Hero: FC<Props> = ({ title, subText, btnText, img, reverse = false }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingTop: "2rem",
        paddingBottom: "2rem",
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
          {title}
        </Typography>

        <Box m="2rem" />

        <Typography
          color="textPrimary"
          variant="h6"
          align={isMobile ? "center" : "left"}
          style={{ fontWeight: "normal" }}
        >
          {subText}
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
            {btnText}
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
        src={img}
        alt=""
      />
    </div>
  );
};

export default Hero;
