import React from "react";
import { useNavigate } from "react-router-dom";

const ProductsCardComponent = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => {
        navigate(`/products/${product._id}`);
      }}
    >
      <img src={product.image} alt="" />
      <div className="card-info">
        {product.name.length > 18 ? (
          <h3>{product.name.slice(0, 18)} ...</h3>
        ) : (
          <h3>{product.name}</h3>
        )}
        <p>
          {product.price && product.price.toLocaleString("en-US")}
          <span>đ</span>
        </p>
      </div>
    </div>
  );
};

export default ProductsCardComponent;
