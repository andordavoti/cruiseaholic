import { FC } from "react";
import Hero from "../components/Hero";
import heroImg from "../assets/hero.jpg";
import hero2Img from "../assets/hero2.jpg";
import { Box } from "@material-ui/core";

const HomePage: FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="space-evenly"
    >
      <Hero
        title="A sea of options"
        subText="Book your next, well deserved vacation, with us."
        btnText="Book cruise"
        img={heroImg}
      />

      <Hero
        title="Get onboard!"
        subText="Daily departures from all of our destinations at 10 am. We hope to see you onboard soon!"
        img={hero2Img}
        hideBtn
        reverse
      />
    </Box>
  );
};

export default HomePage;
