import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

const OrderReferencePage: FC<Props> = ({ match }) => {
  return <div>Reference number: {match.params.id}</div>;
};

export default OrderReferencePage;
