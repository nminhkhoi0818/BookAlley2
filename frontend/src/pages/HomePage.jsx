import React, { useEffect } from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productsAction";
import ProductScrollComponents from "../components/ProductScrollComponents";
import SliderComponent from "../components/SliderComponent";

const HomePage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
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
          minHeight: "100vh",
        }}
      >
        <div className="container home">
          <SliderComponent />
          <ProductScrollComponents
            headerContent="Best Sellers"
            products={products.docs && products.docs.slice(0, 10)}
          />
          <ProductScrollComponents
            headerContent="Just For You"
            products={products.docs && products.docs.slice(10, 30)}
          />
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default HomePage;
