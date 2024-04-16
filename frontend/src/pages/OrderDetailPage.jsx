import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import AddReviewComponent from "../components/AddReviewComponent";

const OrderDetailPage = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let data = await axiosInstance.get(`/api/order/detail/${order_id}`);
        setOrder(data.data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
    fetchData();
  }, []);

  const handleOpenModal = (product_id) => {
    setIsModalOpen(true);
    setProductId(product_id);
  };

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
        <div className="container orders-detail">
          <div className="order-info">
            <div className="self-info">
              <h2>{order.shipping_info && order.shipping_info.fullname}</h2>
              <p>
                <span>Address: </span>
                {order.shipping_info &&
                  order.shipping_info.address +
                    ", Phường " +
                    order.shipping_info.ward +
                    ", Quận " +
                    order.shipping_info.district +
                    ", " +
                    order.shipping_info.city}
              </p>
              <p>Phone: {order.shipping_info && order.shipping_info.phone}</p>
            </div>
            <div className="delivery-info">
              <p>Delivery: {order.shipping_method}</p>
              <p>Arrive on: </p>
              <p>Status: {order.status}</p>
              <p>Payment: Cash</p>
            </div>
            <div className="payment-info">
              {/* <p>Provisonal: 276.000đ</p>
              <p>Shipping: 50.000đ</p> */}
              <p>
                Total: {order.total && order.total.toLocaleString("en-US")}đ
              </p>
            </div>
          </div>
          <div className="orders">
            <h2>Order detail</h2>
            {order.items &&
              order.items.map((item) => {
                return (
                  <div className="order-card" key={item._id}>
                    <div className="order-info">
                      <img src={item.product.image}></img>
                      <div className="order-review">
                        <h3>{item.product.name}</h3>
                        <button
                          type="button"
                          className="review-btn"
                          onClick={() => handleOpenModal(item.product._id)}
                        >
                          Write review
                        </button>
                      </div>
                    </div>
                    <div className="order-total">
                      <p>
                        {item.product.price &&
                          item.product.price.toLocaleString("en-US")}
                        đ
                      </p>
                    </div>
                  </div>
                );
              })}
            <AddReviewComponent
              product_id={productId}
              isOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default OrderDetailPage;
