import {
  Box,
  Button,
  ButtonBase,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Route } from "../../types";
import { ModalType } from "../pages/ManageRoutesPage";
import { addRoute, changeRoute } from "../redux/routeSlice";
import { validateRoute } from "../utils/validateForm";

interface Props {
  type: ModalType;
  editRoute: null | Route;
  open: boolean;
  onClose: () => void;
}

const initialFormData = {
  fromDestination: "",
  toDestination: "",
  priceAdults: 0,
  priceChildren: 0,
  priceVehicle: 0,
};

const ManageRouteModal: FC<Props> = ({ type, open, onClose, editRoute }) => {
  const theme = useTheme();
  const history = useHistory();

  const [formData, setFormData] = useState(initialFormData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (open && editRoute) {
      setFormData(editRoute);
    }
  }, [open, editRoute]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateRoute(formData)) {
      if (type === "ADD") {
        dispatch(addRoute({ route: formData, history }));
      } else if (type === "EDIT" && editRoute?.id) {
        dispatch(
          changeRoute({ route: { ...formData, id: editRoute.id }, history })
        );
      }
      onClose();
    }
  };
  return (
    <Modal
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box bgcolor="#fff" borderRadius={5} padding="1.5rem 2rem">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          paddingBottom="1rem"
        >
          <Typography style={{ fontSize: "1.75rem" }} color="textPrimary">
            {type === "ADD" ? "Add Route" : "Edit Route"}
          </Typography>
          <ButtonBase
            style={{ marginLeft: 15, borderRadius: "50%" }}
            color="secondary"
            onClick={onClose}
          >
            <Close color="secondary" />
          </ButtonBase>
        </Box>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            required
            name="fromDestination"
            type="text"
            label="From Destination"
            variant="outlined"
            color="secondary"
            style={{ margin: "1rem", minWidth: 240 }}
            value={formData.fromDestination}
            onChange={handleChange}
          />

          <TextField
            required
            name="toDestination"
            type="text"
            label="To Destination"
            variant="outlined"
            color="secondary"
            style={{ margin: "1rem", minWidth: 240 }}
            value={formData.toDestination}
            onChange={handleChange}
          />

          <TextField
            required
            name="priceAdults"
            type="number"
            label="Price Adults"
            variant="outlined"
            color="secondary"
            style={{ margin: "1rem", minWidth: 240 }}
            value={formData.priceAdults}
            onChange={handleChange}
          />

          <TextField
            required
            name="priceChildren"
            type="number"
            label="Price Children"
            variant="outlined"
            color="secondary"
            style={{ margin: "1rem", minWidth: 240 }}
            value={formData.priceChildren}
            onChange={handleChange}
          />

          <TextField
            required
            name="priceVehicle"
            type="number"
            label="Price Vehicle"
            variant="outlined"
            color="secondary"
            style={{ margin: "1rem", minWidth: 240 }}
            value={formData.priceVehicle}
            onChange={handleChange}
          />

          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                color: theme.palette.secondary.main,
                borderRadius: 25,
                marginTop: "1rem",
              }}
            >
              {type === "ADD" ? "Save Route" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ManageRouteModal;
