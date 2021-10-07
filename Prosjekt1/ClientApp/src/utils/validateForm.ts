import dayjs from "dayjs";
import { toast } from "../App";
import { Creditcard, TripInfo } from "../../types";

export const validateTripInfo = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  isRoundtrip,
  fromDestination,
  toDestination,
  departureDate,
  arrivalDate,
  numberOfChildren,
  numberOfAdults,
  numberOfVehicles,
}: TripInfo): boolean => {
  if (Number(numberOfChildren) === 0 && Number(numberOfAdults) === 0) {
    toast.error("You must either have a ticket for child or an adult");
    return false;
  }

  if (Number(numberOfAdults) === 0 && Number(numberOfVehicles) !== 0) {
    toast.error(
      "You must have a ticket for an adult to bring a vehicles on board"
    );
    return false;
  }

  if (fromDestination === toDestination) {
    toast.error("From and to destinations cannot be the same");
    return false;
  }

  if (!departureDate) {
    toast.error("No departure date selected");
    return false;
  }

  if (isRoundtrip && !arrivalDate) {
    toast.error("No departure date selected");
    return false;
  }

  if (
    isRoundtrip &&
    departureDate &&
    arrivalDate &&
    dayjs(departureDate).diff(dayjs(arrivalDate), "day") > 0
  ) {
    toast.error("Arrival date cannot be earlier than departure date");
  }

  if (!/^[a-zA-ZæøåÆØÅ. \-]{2,20}$/.test(firstName)) {
    toast.error("First name is not valid!");
    return false;
  }

  if (!/^[a-zA-ZæøåÆØÅ. \-]{2,20}$/.test(lastName)) {
    toast.error("Last name is not valid!");
    return false;
  }

  if (!/^[A-Za-zæøåÆØÅ0-9_\-,\. ]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(email)) {
    toast.error("Email is not valid!");
    return false;
  }

  if (!/^(?:\+[0-9]{10}|[0-9]{8})$/.test(phoneNumber)) {
    toast.error("Phone number is not valid!");
    return false;
  }

  if (!/^[a-zA-ZæøåÆØÅ. \-,]{2,40}$/.test(fromDestination)) {
    toast.error("From destination is not valid!");
    return false;
  }

  if (!/^[a-zA-ZæøåÆØÅ. \-,]{2,40}$/.test(toDestination)) {
    toast.error("To destination is not valid!");
    return false;
  }

  if (
    !/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(
      departureDate
    )
  ) {
    toast.error("Departure date is not valid!");
    return false;
  }

  if (
    isRoundtrip &&
    arrivalDate &&
    !/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(
      arrivalDate
    )
  ) {
    toast.error("Arrival date is not valid!");
    return false;
  }

  return true;
};

export const validatePayment = ({
  cardNumber,
  cardholderName,
  cvc,
  expiry,
}: Creditcard): boolean => {
  if (!/^[0-9]{16}$/.test(cardNumber.toString())) {
    toast.error("Creditcard number is not valid!");
    return false;
  }

  if (!/^[a-zA-ZæøåÆØÅ. \-]{2,100}$/.test(cardholderName)) {
    toast.error("Cardholder name is not valid!");
    return false;
  }

  if (!/^[0-9]{3}$/.test(cvc.toString())) {
    toast.error("Card CVC is not valid!");
    return false;
  }

  if (!/^[0-9 \/]{5}$/.test(expiry)) {
    toast.error("Card expiry is not valid!");
    return false;
  }

  return true;
};
