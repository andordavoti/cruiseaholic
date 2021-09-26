export interface CustomerOrder {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  numberOfAdults: string;
  numberOfChildren: string;
  numberOfVehicles: string;
  isRoundtrip: boolean;
  fromDestination: string;
  toDestination: string;
  departureDate: undefined | string;
  arrivalDate: undefined | null | string;
  cardNumber: number;
  cardholderName: string;
  cvc: number;
  expiry: string;
}
