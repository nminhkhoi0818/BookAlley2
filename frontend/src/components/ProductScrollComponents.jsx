import React from "react";
import ProductsCardComponent from "./ProductCardComponent";

const ProductScrollComponents = ({ headerContent, products }) => {
  return (
    <>
      <div className="products">
        <h2>{headerContent}</h2>
        <div className="product-cards">
          {products &&
            products.map((product) => {
              return (
                <ProductsCardComponent key={product._id} product={product} />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ProductScrollComponents;
