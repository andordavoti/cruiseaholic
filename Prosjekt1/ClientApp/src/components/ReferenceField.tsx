import { Typography } from "@material-ui/core";
import { FC } from "react";

interface Props {
  field: string;
  value: string;
  isLast?: boolean;
}

const ReferenceField: FC<Props> = ({ field, value, isLast = false }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: !isLast ? "0.25rem" : undefined,
        paddingBottom: !isLast ? "0.25rem" : undefined,
        borderBottom: !isLast ? "1px solid #BBBBBB" : undefined,
      }}
    >
      <Typography color="textPrimary" variant="h6">
        {field}:
      </Typography>
      <Typography
        color="textPrimary"
        variant="h6"
        style={{ marginLeft: "1rem", fontWeight: "normal" }}
      >
        {value}
      </Typography>
    </div>
  );
};

export default ReferenceField;
