import { useMediaQuery } from "@mui/material";

export const useIsMobile = () =>
  useMediaQuery("only screen and (max-width: 768px)");
