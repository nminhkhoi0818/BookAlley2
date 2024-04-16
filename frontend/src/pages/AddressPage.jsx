import React, { useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAddress } from "../actions/userActions";

const AddressPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    alias: "",
    type: "Home/Apartment",
  });
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    dispatch(updateAddress(formData));
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
        <div className="container address-page">
          <h2>Shipping address</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="row">
              <label htmlFor="fullname">Fullname</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label htmlFor="district">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label htmlFor="ward">Ward</label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label htmlFor="alias">Alias</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
              />
            </div>
            <div className="address-row">
              <label htmlFor="address">Type</label>
              <div className="address-input">
                <div>
                  <input
                    type="radio"
                    id="home"
                    name="address"
                    value="Home/Apartment"
                    checked={formData.type === "Home/Apartment"}
                    onChange={handleChange}
                  />
                  <label htmlFor="home">Home/Apartment</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="company"
                    name="address"
                    value="Company"
                    checked={formData.type === "Company"}
                    onChange={handleChange}
                  />
                  <label htmlFor="company">Company</label>
                </div>
              </div>
            </div>
            <div className="btn-row">
              <button type="button" className="cancel-btn">
                <Link to={"/checkout/cart"} style={{ color: "#4e6975" }}>
                  Cancel
                </Link>
              </button>
              <button type="submit" className="update-btn">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default AddressPage;
