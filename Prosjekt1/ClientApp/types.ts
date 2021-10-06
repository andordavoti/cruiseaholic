export interface Creditcard {
  cardNumber: number;
  cardholderName: string;
  cvc: number;
  expiry: string;
}

export interface TripInfo {
  // TRIP
  numberOfAdults: string;
  numberOfChildren: string;
  numberOfVehicles: string;
  isRoundtrip: boolean;
  departureDate: undefined | string;
  arrivalDate: undefined | null | string;

  // CUSTOMER
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  // ROUTE
  fromDestination: string;
  toDestination: string;
}

export interface CustomerOrder extends Creditcard, TripInfo {}

export interface CustomerInfo {
  id: number;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  orders: Order[];
}

export interface Order {
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
