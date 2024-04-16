import React, { useEffect } from "react";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../actions/orderAction";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const navigate = useNavigate();

  const handleClickOrderDetail = (orderId) => {
    navigate(`/order/view/${orderId}`);
  };

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  return (
    <>
      <HeaderComponent />
      <div
        className="container-fluid"
        style={{
          backgroundColor: "#F0F0F0",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
        }}
      >
        <div className="container orders">
          <h2>My order</h2>
          {orders.docs &&
            orders.docs.map((order) => {
              return (
                <div
                  className="order-card"
                  key={order._id}
                  onClick={() => handleClickOrderDetail(order._id)}
                >
                  <div className="order-info">
                    <img src={order.items[0].product.image}></img>
                    <div>
                      <h3>{order.items[0].product.name}</h3>
                      <p>Status: {order.status}</p>
                    </div>
                  </div>
                  <div className="order-total">
                    <p>{order.total && order.total.toLocaleString("en-US")}đ</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default OrderPage;
