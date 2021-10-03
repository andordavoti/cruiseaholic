export interface CustomerOrder {
  // TRIP
  numberOfAdults: string;
  numberOfChildren: string;
  numberOfVehicles: string;
  isRoundtrip: boolean;
  departureDate: undefined | string;
  arrivalDate: undefined | null | string;

  // CREDITCARD
  cardNumber: number;
  cardholderName: string;
  cvc: number;
  expiry: string;

  // CUSTOMER
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  // ROUTE
  fromDestination: string;
  toDestination: string;
}

export interface CustomerInfo {
  id: number;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  orders: Order[];
}

interface Order {
  id: number;

  // TRIP
  numberOfAdults: string;
  numberOfChildren: string;
  numberOfVehicles: string;
  isRoundtrip: boolean;
  departureDate: undefined | string;
  arrivalDate: undefined | null | string;

  // CREDITCARD
  cardNumber: number;
  cardholderName: string;
  cvc: number;
  expiry: string;

  route: Route;
}

export interface Route {
  id: number;
  fromDestination: string;
  toDestination: string;
  priceChildren: number;
  priceAdults: number;
  priceVehicle: number;
}