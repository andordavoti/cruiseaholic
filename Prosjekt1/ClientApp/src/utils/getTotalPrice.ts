import { Route } from "../../types";

export const getTotalPrice = (
  route: undefined | Route,
  numberOfAdults: string | number,
  numberOfChildren: string | number,
  numberOfVehicles: string | number,
  isRoundtrip: boolean
): string => {
  if (!route) return "Choose a route to see the total price";
  const priceAdults = route.priceAdults * Number(numberOfAdults);
  const priceChildren = route.priceChildren * Number(numberOfChildren);
  const priceVeichles = route.priceVehicle * Number(numberOfVehicles);
  const totalOneWay = priceAdults + priceChildren + priceVeichles;

  return `${isRoundtrip ? totalOneWay * 2 : totalOneWay} NOK`;
};
