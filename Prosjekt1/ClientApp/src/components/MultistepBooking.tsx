import React, { Dispatch, SetStateAction } from "react";
import { Box } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";

interface Props {
  tripDetails: JSX.Element;
  paymentDetails: JSX.Element;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const MultistepBooking: React.FC<Props> = ({
  tripDetails,
  paymentDetails,
  activeStep,
  setActiveStep,
}) => {
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="2rem 1rem"
    >
      <SwipeableViews
        axis="x"
        index={activeStep}
        onChangeIndex={handleStepChange}
      >
        {tripDetails}
        {paymentDetails}
      </SwipeableViews>
    </Box>
  );
};

export default MultistepBooking;
