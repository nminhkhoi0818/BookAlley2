import React, { useEffect, useState } from "react";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import ReviewsComponent from "../components/ReviewsComponent";
import { useDispatch } from "react-redux";
import { addCart, getCart } from "../actions/cartAction";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        let data = await axiosInstance.get(`/api/book/get-detail/${id}`);
        setProduct(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCountChange = (e) => {
    const newValue = parseInt(e.target.value);
    setCount(newValue);
  };

  const decreaseValue = () => {
    if (count - 1 >= 0) setCount(count - 1);
  };

  const increaseValue = () => {
    setCount(count + 1);
  };

  const handleAddToCart = async () => {
    const result = await dispatch(
      addCart({ product_id: product._id, quantity: count.toString() })
    );
    if (addCart.fulfilled.match(result)) {
      dispatch(getCart());
    }
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
        <div className="container product-detail">
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <div className="product-card">
                <div className="col">
                  <img src={product.image} alt="" />
                </div>
                <div className="product-info">
                  <h2>{product.name}</h2>
                  <p className="author">Author: {product.author}</p>
                  {product.translator && (
                    <p className="translator">
                      Translator: {product.translator}
                    </p>
                  )}
                  <p className="price">
                    {product.price && product.price.toLocaleString("en-US")}
                    <span>đ</span>
                  </p>
                  <div className="btn">
                    <div className="value-btn" onClick={decreaseValue}>
                      -
                    </div>
                    <input
                      type="number"
                      id="number"
                      value={count}
                      onChange={handleCountChange}
                    />
                    <div className="value-btn" onClick={increaseValue}>
                      +
                    </div>
                  </div>
                  <div className="cart-btn">
                    <Link
                      to="/checkout/payment"
                      state={{
                        selectedItems: [{ product: product, quantity: count }],
                        totalPrice: product.price * count,
                      }}
                    >
                      <button className="buy-btn">Buy</button>
                    </Link>
                    <button className="add-btn" onClick={handleAddToCart}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>

              <div className="detail-info">
                <div className="left">
                  <div className="shop-card">
                    <Link to={product.seller && `/shop/${product.seller._id}`}>
                      <img src={product.seller && product.seller.logo} alt="" />
                    </Link>
                    <div className="shop-info">
                      <Link
                        to={product.seller && `/shop/${product.seller._id}`}
                      >
                        <h3>{product.seller && product.seller.name}</h3>
                      </Link>
                    </div>
                  </div>
                  <div className="detail-card">
                    <h2>DETAILS</h2>
                    <p>
                      Author: <span>{product.author}</span>
                    </p>
                    {product.translator ? (
                      <p>
                        Translator: <span>{product.translator}</span>
                      </p>
                    ) : null}

                    <p>
                      Publisher: <span>{product.publisher}</span>
                    </p>
                    <p>
                      Publish Date: <span>{product.year_published}</span>
                    </p>
                    <p>
                      Page Count: <span>{product.pages}</span>
                    </p>
                    <p>
                      Dimensions: <span>{product.size}</span>
                    </p>
                  </div>
                </div>
                <div className="right">
                  <div className="description-card">
                    <h2>DESCRIPTION</h2>
                    <p className="description">
                      {product.description && product.description.length > 100
                        ? product.description.slice(0, 800) + "..."
                        : product.description}
                    </p>
                  </div>
                </div>
              </div>
              <ReviewsComponent product_id={id} />
            </>
          )}
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default ProductDetailPage;
