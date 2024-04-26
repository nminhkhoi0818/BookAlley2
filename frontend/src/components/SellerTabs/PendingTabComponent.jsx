import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { processOrderSeller } from "../../actions/sellerAction";
import { ToastContainer, toast } from "react-toastify";

const PendingTabComponent = () => {
  const { orders } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const handleProcess = (order_id, status) => {
    dispatch(processOrderSeller({ order_id: order_id, status })).then(
      (result) => {
        if (processOrderSeller.fulfilled.match(result)) {
          toast.success("Process successfully", {
            position: "bottom-right",
          });
        } else {
          toast.error(error, {
            position: "bottom-right",
          });
        }
      }
    );
  };

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
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order) => {
              if (order.status == "pending") {
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.shipping_method}</td>
                    <td>{order.payment_method}</td>
                    <td>
                      {order.total && order.total.toLocaleString("en-US")}đ
                    </td>
                    <td>{order.status}</td>
                    <td>
                      <button
                        className="process-btn"
                        onClick={() => handleProcess(order._id, "delivering")}
                      >
                        Delivery
                      </button>
                    </td>
                    <td>
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleProcess(order._id, "canceled")}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
        </tbody>
      </table>
      <ToastContainer />
    </>
  );
};

export default PendingTabComponent;
