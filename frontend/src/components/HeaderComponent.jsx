import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../reducers/authSlice";
import { clearCart } from "../reducers/cart/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import { userLogout } from "../actions/authAction";
import { getCart } from "../actions/cartAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderComponent = () => {
  const { cart } = useSelector((state) => state.cart);
  const { access_token } = useSelector((state) => state.auth);
  const { infos } = useSelector((state) => state.user);
  const [openAccount, setOpenAccount] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = () => toast("You need to verify first");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  useEffect(() => {
    dispatch(getCart());
  }, []);

  return (
    <>
      <div className="container header" style={{ backgroundColor: "#fff" }}>
        <div className="header-left">
          <Link to="/">
            <img src="/images/Logo.png" alt="" />
          </Link>
          <div className="search">
            <form action="" onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
        <div className="header-right">
          <Link to="/">
            <div className="seller-btn">
              <FontAwesomeIcon icon={faHome} />
              <p>Home</p>
            </div>
          </Link>
          {access_token ? (
            infos.role == "seller" ? (
              <div
                className="account"
                onMouseEnter={() => setOpenAccount(true)}
                onMouseLeave={() => setOpenAccount(false)}
              >
                <div className="seller-btn">
                  <FontAwesomeIcon icon={faUser} />
                  Account
                </div>
                {openAccount && (
                  <div className="account-content">
                    <Link to="/seller">My Shop</Link>
                    <a
                      onClick={() => {
                        dispatch(logout());
                        dispatch(userLogout());
                        dispatch(clearCart());
                      }}
                    >
                      Log out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="account"
                onMouseEnter={() => setOpenAccount(true)}
                onMouseLeave={() => setOpenAccount(false)}
              >
                <div className="seller-btn">
                  <FontAwesomeIcon icon={faUser} />
                  Account
                </div>
                {openAccount && (
                  <div className="account-content">
                    <Link to="/order/history">My orders</Link>
                    <a
                      onClick={() => {
                        dispatch(logout());
                        dispatch(userLogout());
                        dispatch(clearCart());
                      }}
                    >
                      Log out
                    </a>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="seller-btn">
              <FontAwesomeIcon icon={faUser} />
              <Link to="/signin">Account</Link>
            </div>
          )}
          {cart ? (
            <Link to="/checkout/cart">
              <div className="icon-wrapper">
                <div className="bubble">
                  {cart.items
                    ? cart.items.reduce((total, item) => {
                        return total + item.quantity;
                      }, 0)
                    : 0}
                </div>
                <img src="/images/Cart.png" alt="" />
              </div>
            </Link>
          ) : (
            <>
              <div className="icon-wrapper" onClick={notify}>
                <div className="bubble">0</div>
                <img src="/images/Cart.png" alt="" />
              </div>
              <ToastContainer />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;
