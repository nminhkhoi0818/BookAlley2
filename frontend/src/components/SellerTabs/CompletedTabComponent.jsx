import React from "react";
import { useSelector } from "react-redux";

const CompletedTabComponent = () => {
  const { orders } = useSelector((state) => state.seller);

  return (
    <>
      <table className="data-tab">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Shipping Method</th>
            <th>Payment method</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.docs &&
            orders.docs.map((order) => {
              if (order.status == "completed") {
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.shipping_method}</td>
                    <td>{order.payment_method}</td>
                    <td>
                      {order.total && order.total.toLocaleString("en-US")}đ
                    </td>
                    <td>{order.status}</td>
                  </tr>
                );
              }
            })}
        </tbody>
      </table>
    </>
  );
};

export default CompletedTabComponent;
