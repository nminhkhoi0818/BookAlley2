import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListCheck,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import {
  getOrdersForSeller,
  getProductsForSeller,
} from "../../actions/sellerAction";
import { useDispatch, useSelector } from "react-redux";
import PendingTabComponent from "../../components/SellerTabs/PendingTabComponent";
import DeliveringTabComponent from "../../components/SellerTabs/DeliveringTabComponent";
import CompletedTabComponent from "../../components/SellerTabs/CompletedTabComponent";
import CanceledTabComponent from "../../components/SellerTabs/CanceledTabComponent";

const OrdersSellerPage = () => {
  const dispatch = useDispatch();
  const { infos } = useSelector((state) => state.seller);
  const [activeTab, setActiveTab] = useState("pending");

  const handlePendingTab = () => {
    setActiveTab("pending");
  };

  const handleDeliveringTab = () => {
    setActiveTab("delivering");
  };

  const handleCompletedTab = () => {
    setActiveTab("completed");
  };

  const handleCanceledTab = () => {
    setActiveTab("canceled");
  };

  useEffect(() => {
    dispatch(getProductsForSeller());
    dispatch(getOrdersForSeller());
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
        <div className="container seller">
          <div className="seller-info">
            <div className="left">
              <div className="seller-btn">
                <FontAwesomeIcon icon={faHome} />
                <Link to={"/seller"}>Home</Link>
              </div>
              <div className="seller-btn active">
                <FontAwesomeIcon icon={faListCheck} />
                <Link to={"/seller/orders"}>Orders</Link>
              </div>
              <div className="seller-btn">
                <FontAwesomeIcon icon={faRectangleList} />
                <Link to={"/seller/products"}>Products</Link>
              </div>
            </div>
            <div className="right">
              <img src={infos.logo} alt="" />
              <div className="info-text">
                <h2>{infos.name}</h2>
                <p>
                  <span style={{ fontSize: "150%", color: "yellow" }}>
                    &#9733;
                  </span>{" "}
                  {infos.rating}
                  /5 | {infos.followers} followers
                </p>
              </div>
            </div>
          </div>
          <div className="seller-products-detail">
            <h2>Orders</h2>
            <div className="tabs">
              <ul className="nav">
                <li
                  className={activeTab === "pending" ? "active" : ""}
                  onClick={handlePendingTab}
                >
                  Pending
                </li>
                <li
                  className={activeTab === "delivering" ? "active" : ""}
                  onClick={handleDeliveringTab}
                >
                  Delivering
                </li>
                <li
                  className={activeTab === "completed" ? "active" : ""}
                  onClick={handleCompletedTab}
                >
                  Completed
                </li>
                <li
                  className={activeTab === "canceled" ? "active" : ""}
                  onClick={handleCanceledTab}
                >
                  Canceled
                </li>
              </ul>
            </div>
            <div className="outlet">
              {activeTab === "pending" && <PendingTabComponent />}
              {activeTab === "delivering" && <DeliveringTabComponent />}
              {activeTab === "completed" && <CompletedTabComponent />}
              {activeTab === "canceled" && <CanceledTabComponent />}
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default OrdersSellerPage;
