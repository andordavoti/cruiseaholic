import { useMediaQuery } from "@material-ui/core";

export const useIsMobile = () =>
  useMediaQuery("only screen and (max-width: 768px)");
