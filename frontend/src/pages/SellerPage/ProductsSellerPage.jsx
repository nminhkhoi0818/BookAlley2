import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faListCheck,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { getProductsForSeller } from "../../actions/sellerAction";
import { useDispatch, useSelector } from "react-redux";

const ProductsSellerPage = () => {
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
              <div className="seller-btn">
                <FontAwesomeIcon icon={faHome} />
                <Link to={"/seller"}>Home</Link>
              </div>
              <div className="seller-btn">
                <FontAwesomeIcon icon={faListCheck} />
                <Link to={"/seller/orders"}>Orders</Link>
              </div>
              <div className="seller-btn active">
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
            <h2>Products</h2>
            <div className="utils-seller">
              <Link to={"/seller/products/add"}>
                <button type="submit">Create New Book</button>
              </Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>In Stock</th>
                  <th>Sold</th>
                </tr>
              </thead>
              <tbody>
                {infos.listings &&
                  infos.listings.map((book, index) => {
                    return (
                      <tr key={book._id}>
                        <td>{index + 1}</td>
                        <td style={{ width: "70%" }}>{book.name}</td>
                        <td>
                          {book.price && book.price.toLocaleString("en-US")}đ
                        </td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default ProductsSellerPage;
