import { FC, useRef } from "react";
import Booking from "../components/Booking";
import Hero from "../components/Hero";

const HomePage: FC = () => {
  const heroRef = useRef<null | HTMLDivElement>(null);

  return (
    <>
      <div ref={heroRef}>
        <Hero
          onAction={() =>
            window.scrollTo({
              top: heroRef.current?.clientHeight,
              behavior: "smooth",
            })
          }
        />
      </div>

      <Booking />
    </>
  );
};

export default HomePage;
