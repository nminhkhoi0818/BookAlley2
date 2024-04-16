import { useLocation, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "../actions/orderAction";
import { useEffect, useState } from "react";
import { getAddress } from "../actions/userActions";

const CheckoutPage = () => {
  const location = useLocation();
  const { selectedItems, totalPrice } = location.state || {};
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { name, phone, address, addressId } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    dispatch(
      addOrder({
        shipping_info: addressId,
        shipping_method: selectedDelivery,
        payment_method: paymentMethod,
        items: selectedItems.map((item) => {
          return {
            product: item.product._id,
            quantity: item.quantity,
          };
        }),
      })
    ).then((result) => {
      if (addOrder.fulfilled.match(result)) {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    dispatch(getAddress());
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
        <div className="container checkout">
          <div className="left">
            <div className="payment-part">
              <div className="delivery">
                <h2>DELIVERY</h2>
                <div className="delivery-type">
                  <input
                    type="radio"
                    id="same-day"
                    name="delivery"
                    onChange={() => setSelectedDelivery("Same-day delivery")}
                  />
                  <label htmlFor="same-day">Same-day delivery</label>
                </div>
                <div className="delivery-type">
                  <input
                    type="radio"
                    id="overnight"
                    name="delivery"
                    onChange={() => setSelectedDelivery("Overnight delivery")}
                  />
                  <label htmlFor="overnight">Overnight delivery</label>
                </div>
                <div className="delivery-type">
                  <input
                    type="radio"
                    id="international"
                    name="delivery"
                    onChange={() =>
                      setSelectedDelivery("International delivery")
                    }
                  />
                  <label htmlFor="international">International delivery</label>
                </div>
                <div className="delivery-type">
                  <input
                    type="radio"
                    id="normal"
                    name="delivery"
                    onChange={() => setSelectedDelivery("Normal delivery")}
                  />
                  <label htmlFor="normal">Normal delivery</label>
                </div>
              </div>
              <div className="payment">
                <h2>PAYMENT</h2>
                <div className="payment-type">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    onChange={() => setPaymentMethod("In cash")}
                  />
                  <label htmlFor="cash">In cash</label>
                </div>
                <div className="payment-type">
                  <input type="radio" id="paypal" name="payment" disabled />
                  <label htmlFor="paypal">Paypal</label>
                </div>
                <div className="payment-type">
                  <input type="radio" id="momo" name="payment" disabled />
                  <label htmlFor="momo">Momo</label>
                </div>
                <div className="payment-type">
                  <input type="radio" id="banking" name="payment" disabled />
                  <label htmlFor="banking">Internet Banking</label>
                </div>
              </div>
            </div>

            <div className="products-list">
              <h2>PRODUCTS LIST</h2>
              <div className="products-header">
                <div style={{ width: "390px" }}>
                  <span>Product</span>
                </div>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>
              {selectedItems &&
                selectedItems.map((item, index) => {
                  return (
                    <div className="product-item" key={index}>
                      <div
                        style={{
                          width: "390px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img src={item.product.image} alt="" />
                        <p>{item.product.name}</p>
                      </div>
                      <span>
                        {item.product.price &&
                          item.product.price.toLocaleString("en-US")}
                        đ
                      </span>
                      <span>{item.quantity}</span>
                      <span>
                        {item.product.price * item.quantity &&
                          (item.product.price * item.quantity).toLocaleString(
                            "en-US"
                          )}
                        đ
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="cart-main">
            <div className="delivery">
              <h3>Deliver to</h3>
              <span>
                {name} | {phone}
              </span>
              <p>{address}</p>
            </div>
            <div className="voucher">
              <h3>Voucher</h3>
              <p>Choose your voucher</p>
            </div>
            <div className="total">
              <div className="total-provisional">
                <p>Provisional</p>
                <span>{totalPrice && totalPrice.toLocaleString("en-US")}đ</span>
              </div>

              <hr />
              <div className="total-count">
                <p>Total</p>
                <span>{totalPrice && totalPrice.toLocaleString("en-US")}đ</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
};

export default CheckoutPage;
