import { Route } from "../../types";

export const getFromDestinations = (routes: Route[]) => {
  const fromDestinations: string[] = [];

  for (let i = 0; i < routes.length; i++) {
    const fromDestination = routes[i].toDestination;
    if (!fromDestinations.includes(fromDestination)) {
      fromDestinations.push(fromDestination);
    }
  }
  return fromDestinations;
};
