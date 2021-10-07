import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import { FC, useState } from "react";
import { Order } from "../../types";
import { getTotalPrice } from "../utils/getTotalPrice";
import ReferenceField from "./ReferenceField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface Props {
  order: Order;
}

const OrderCard: FC<Props> = ({
  order: {
    route,
    departureDate,
    returnDate,
    isRoundtrip,
    numberOfAdults,
    numberOfChildren,
    numberOfVehicles,
    id,
  },
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Accordion
      style={{
        backgroundColor: "white",
        marginTop: "1rem",
        borderRadius: 25,
        border: "1px solid #EEEEEE",
      }}
      expanded={expanded}
      onChange={() => setExpanded((prev) => !prev)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{ padding: "1rem" }}
      >
        <Typography color="textPrimary" variant="h5">
          Order {id}:
        </Typography>
      </AccordionSummary>

      <AccordionDetails style={{ display: "flex", flexDirection: "column" }}>
        <ReferenceField
          field="From destination"
          value={route.fromDestination}
        />
        <ReferenceField field="To destination" value={route.toDestination} />
        {!!departureDate && (
          <ReferenceField field="Departure date" value={departureDate} />
        )}
        {!!returnDate && (
          <ReferenceField field="Return date" value={returnDate} />
        )}
        <ReferenceField field="Adults" value={numberOfAdults} />
        <ReferenceField field="Children" value={numberOfChildren} />
        <ReferenceField field="Vehicles" value={numberOfVehicles} />
        <ReferenceField
          field="Total price"
          value={getTotalPrice(
            route,
            numberOfAdults,
            numberOfChildren,
            numberOfVehicles,
            isRoundtrip
          )}
          isLast
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderCard;
