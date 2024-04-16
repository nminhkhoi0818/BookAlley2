import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { axiosInstance } from "../utils/axios";
import ProductScrollComponents from "../components/ProductScrollComponents";

const ShopPage = () => {
  const { shop_id } = useParams();
  const [shop, setShop] = useState({});
  useEffect(() => {
    // setLoading(true);
    async function fetchData() {
      try {
        let data = await axiosInstance.get(`/api/shop/get-detail/${shop_id}`);
        console.log(data);
        setShop(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        // setLoading(false);
      }
    }
    fetchData();
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
        <div className="container shop">
          <div className="shop-info">
            <img src={shop.logo} alt="" />
            <div className="shop-text">
              <h3>{shop.name}</h3>
            </div>
          </div>
          <ProductScrollComponents
            headerContent="Products"
            products={shop.listings}
          />
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default ShopPage;
