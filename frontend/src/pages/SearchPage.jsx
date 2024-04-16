import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useSearchParams } from "react-router-dom";
import { axiosPublicInstance } from "../utils/axios";
import ProductsCardComponent from "../components/ProductCardComponent";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const searchTerm = searchParams.get("q");
      if (searchTerm) {
        const { data } = await axiosPublicInstance.get(
          `api/book/search?searchTerm=${searchTerm}`,
          config
        );
        setProducts(data.docs);
      }
    }
    fetchData();
  }, [searchParams]);

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
        <div className="container search-items">
          <div className="products">
            <h2>Search Result</h2>
            <div className="product-cards">
              {products &&
                products.map((product) => {
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

export default SearchPage;
