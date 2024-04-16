import React, { useEffect } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { useDispatch, useSelector } from "react-redux";
import ProductsCardComponent from "../../components/ProductCardComponent";
import { Link } from "react-router-dom";
import { getProductsForSeller } from "../../actions/sellerAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListCheck,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";

const SellerPage = () => {
  const dispatch = useDispatch();
  const { infos } = useSelector((state) => state.seller);
  useEffect(() => {
    dispatch(getProductsForSeller());
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
              <div className="seller-btn active">
                <FontAwesomeIcon icon={faHome} />
                <Link to={"/"}>Home</Link>
              </div>
              <div className="seller-btn">
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
          <div className="seller-products">
            <h2>Products</h2>
            <div className="product-cards">
              {infos.listings &&
                infos.listings.map((product) => {
                  return (
                    <ProductsCardComponent
                      key={product._id}
                      product={product}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default SellerPage;
