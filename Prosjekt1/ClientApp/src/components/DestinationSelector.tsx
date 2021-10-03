import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { FC } from "react";

interface Props {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: null | string[];
}

const DestinationSelector: FC<Props> = ({
  label,
  value,
  setValue,
  options,
}) => {
  return (
    <FormControl
      variant="outlined"
      color="secondary"
      style={{ margin: "1rem", minWidth: 220 }}
    >
      <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={value}
        onChange={(e) => setValue(e.target.value as string)}
        label={label}
      >
        <MenuItem value="">
          <em>You must select a destination!</em>
        </MenuItem>

        {options?.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DestinationSelector;
