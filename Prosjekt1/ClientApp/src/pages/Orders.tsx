import { FC, useCallback, useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { Order } from "../types/Order";

const Orders: FC = () => {
  const [orders, setOrders] = useState<null | Order[]>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("order/getAll");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      alert("Something went wrong...");
      console.log(err);
    }
  }, []);

  const removeOrder = async (id: number) => {
    try {
      await fetch(`order/removeOrder?id=${id}`);
      await fetchOrders();
    } catch (error) {
      alert("Something went wrong...");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <h3
        style={{
          marginTop: "3rem",
          textAlign: "center",
        }}
      >
        Loading...
      </h3>
    );
  }

  if (orders && !orders.length) {
    return (
      <h3
        style={{
          marginTop: "3rem",
          textAlign: "center",
        }}
      >
        No orders
      </h3>
    );
  }

  return (
    <div>
      <h3>Current orders</h3>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Pizza Type</th>
            <th>Pizza Style</th>
            <th>Quantity</th>
            <th>Full Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        {orders?.map(
          (
            {
              id,
              pizzaType,
              pizzaStyle,
              quantity,
              fullName,
              address,
              email,
              phoneNumber,
            },
            index
          ) => (
            <tbody key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{pizzaType}</td>
                <td>{pizzaStyle}</td>
                <td>{quantity}</td>
                <td>{fullName}</td>
                <td>{address}</td>
                <td>{email}</td>
                <td>{phoneNumber}</td>
                <td>
                  <Button color="danger" onClick={() => removeOrder(id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            </tbody>
          )
        )}
      </Table>
    </div>
  );
};

export default Orders;
