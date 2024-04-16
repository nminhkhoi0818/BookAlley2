import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getCart, modifyItems, removeItems } from "../actions/cartAction";
import { Link } from "react-router-dom";
import { getAddress } from "../actions/userActions";

const CartPage = () => {
  const { loading, cart } = useSelector((state) => state.cart);
  const { name, phone, address } = useSelector((state) => state.user);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAllItems, setSelectedAllItems] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart());
    dispatch(getAddress());
  }, []);

  const handleAllCheckboxChange = () => {
    setSelectedAllItems(() => {
      const updatedAllItems = !selectedAllItems;
      if (updatedAllItems) {
        const allProductIds = cart.items.map(
          (cartItem) => cartItem.product._id
        );
        setSelectedItems(allProductIds);
      } else {
        setSelectedItems([]);
      }
      return updatedAllItems;
    });
  };

  const handleCheckboxChange = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems((prevSelected) => {
        const updatedSelected = prevSelected.filter((id) => id !== productId);
        if (selectedAllItems) {
          setSelectedAllItems(false);
        }
        return updatedSelected;
      });
    } else {
      setSelectedItems((prevSelected) => {
        const updatedSelected = [...prevSelected, productId];
        if (updatedSelected.length == cart.items.length) {
          setSelectedAllItems(true);
        }
        return updatedSelected;
      });
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.items &&
      cart.items.forEach((cartItem) => {
        if (selectedItems.includes(cartItem.product._id)) {
          totalPrice += cartItem.product.price * cartItem.quantity;
        }
      });
    return totalPrice;
  };

  const handleRemoveToCart = async (product_id, quantity) => {
    const result = dispatch(
      removeItems({ product_id, quantity: quantity.toString() })
    );
  };

  const handleItemChange = async (product_id, quantity) => {
    const result = dispatch(
      modifyItems({ product_id, quantity: quantity.toString() })
    );
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
        <div className="container cart">
          <div className="cart-product">
            <h2>CART</h2>
            <div className="cart-header">
              <label className="checkmark-container">
                Product
                <input
                  type="checkbox"
                  checked={selectedAllItems}
                  onChange={() => handleAllCheckboxChange()}
                />
                <span className="checkmark"></span>
              </label>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ cursor: "pointer" }}
              />
            </div>
            {cart.items &&
              cart.items.map((cartItem) => {
                return (
                  <div className="cart-item" key={cartItem._id}>
                    <label className="checkmark-container name-image">
                      <Link
                        style={{ display: "flex", alignItems: "center" }}
                        to={`/products/${cartItem.product._id}`}
                      >
                        <img src={cartItem.product.image} alt="" />
                        <p>{cartItem.product.name}</p>
                      </Link>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(cartItem.product._id)}
                        onChange={() =>
                          handleCheckboxChange(cartItem.product._id)
                        }
                      />
                      <span className="checkmark checkmark-center"></span>
                    </label>
                    <span>
                      {cartItem.product.price.toLocaleString("en-US")}đ
                    </span>
                    <div class="qty-input">
                      <button
                        class="qty-count qty-count--minus"
                        data-action="minus"
                        type="button"
                        onClick={() =>
                          handleItemChange(cartItem.product._id, -1)
                        }
                      >
                        -
                      </button>
                      <input
                        class="product-qty"
                        type="number"
                        name="product-qty"
                        min="0"
                        max="10"
                        value={cartItem.quantity}
                      />
                      <button
                        class="qty-count qty-count--add"
                        data-action="add"
                        type="button"
                        onClick={() =>
                          handleItemChange(cartItem.product._id, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <span>
                      {(
                        cartItem.product.price * cartItem.quantity
                      ).toLocaleString("en-US")}
                      đ
                    </span>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      onClick={() => {
                        handleRemoveToCart(
                          cartItem.product._id,
                          cartItem.quantity
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                );
              })}
          </div>
          <div className="cart-main">
            <div className="delivery">
              <div className="address">
                <h3>Deliver to</h3>
                <Link to="/order/shipping">Change</Link>
              </div>
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
                <span>
                  {cart.items && calculateTotalPrice().toLocaleString("en-US")}đ
                </span>
              </div>

              <hr />
              <div className="total-count">
                <p>Total</p>
                <span>
                  {cart.items && calculateTotalPrice().toLocaleString("en-US")}đ
                </span>
              </div>
              <Link
                to="/checkout/payment"
                state={{
                  selectedItems:
                    cart.items &&
                    cart.items.filter((item) => {
                      return selectedItems.includes(item.product._id);
                    }),
                  totalPrice: calculateTotalPrice(),
                }}
              >
                <button className="checkout-btn">Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default CartPage;
