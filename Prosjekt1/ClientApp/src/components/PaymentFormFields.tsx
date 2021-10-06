import { FC, MutableRefObject } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import Cards from "react-credit-cards";
import { CreditcardFormData, FormData } from "../pages/BookingPage";
import { getTotalPrice } from "../utils/getTotalPrice";
import { Route } from "../../types";
import { useIsMobile } from "../hooks/useIsMobile";

interface Props {
  creditcardData: CreditcardFormData;
  handleCreditcardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expiryRef: MutableRefObject<HTMLInputElement | null>;
  selectedRoute: undefined | Route;
  formData: FormData;
  isRoundtrip: boolean;
  back: () => void;
}

const PaymentFormFields: FC<Props> = ({
  creditcardData,
  handleCreditcardInputChange,
  expiryRef,
  selectedRoute,
  formData,
  isRoundtrip,
  back,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "1rem",
          width: "100%",
        }}
      >
        <Cards
          cvc={creditcardData.cvc}
          expiry={creditcardData.expiry}
          focused={creditcardData.focus}
          name={creditcardData.name}
          number={creditcardData.number}
        />
      </div>

      <TextField
        required
        name="number"
        type="number"
        label="Card Number"
        variant="outlined"
        color="secondary"
        style={{ margin: "1rem", minWidth: 240 }}
        value={creditcardData.number}
        onChange={handleCreditcardInputChange}
      />

      <TextField
        required
        name="name"
        type="text"
        label="Cardholder Name"
        variant="outlined"
        color="secondary"
        style={{ margin: "1rem", minWidth: 240 }}
        value={creditcardData.name}
        onChange={handleCreditcardInputChange}
      />

      <TextField
        required
        name="cvc"
        type="number"
        label="CVC"
        variant="outlined"
        color="secondary"
        style={{ margin: "1rem", minWidth: 240 }}
        value={creditcardData.cvc}
        onChange={handleCreditcardInputChange}
      />

      <TextField
        ref={expiryRef}
        required
        name="expiry"
        type="text"
        label="Expiry (MM/YY)"
        variant="outlined"
        color="secondary"
        style={{ margin: "1rem", minWidth: 240 }}
        value={creditcardData.expiry.replaceAll(" ", "")}
        onChange={handleCreditcardInputChange}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <Typography color="textPrimary" variant="h6" align="center">
          Total price:
          <Typography
            color="textPrimary"
            variant="h6"
            style={{ fontWeight: "normal", marginLeft: "0.5rem" }}
          >
            {getTotalPrice(
              selectedRoute,
              formData.numberOfAdults,
              formData.numberOfChildren,
              formData.numberOfVehicles,
              isRoundtrip
            )}
          </Typography>
        </Typography>

        <Box display="flex" marginBottom="2rem" marginTop="1rem">
          {!isMobile && (
            <Button
              onClick={back}
              variant="contained"
              color="primary"
              style={{
                color: theme.palette.secondary.main,
                borderRadius: 25,
                marginRight: "0.5rem",
              }}
            >
              Back
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              color: theme.palette.secondary.main,
              borderRadius: 25,
              marginLeft: "0.5rem",
            }}
          >
            Submit
          </Button>
        </Box>
      </div>
    </>
  );
};

export default PaymentFormFields;
