import React, { useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { useDispatch } from "react-redux";
import { addProduct } from "../../actions/productsAction";
import { Link } from "react-router-dom";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    description: "",
    price: undefined,
    translator: "",
    publisher: "",
    year_published: undefined,
    weight: undefined,
    size: "",
    pages: undefined,
    binding_method: "",
    instock: undefined,
    language: "",
    tags: [],
  });
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    dispatch(addProduct(formData));
  };

  const handleTagsChange = (event) => {
    const tagArray = [event.target.value];
    setFormData({ ...formData, tags: tagArray });
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
        <form className="container seller-add" onSubmit={handleSubmit}>
          <div className="general-info-card">
            <h2>1. General Information</h2>
            <hr />
            <label htmlFor="">Product name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="">Tags</label>
            <input type="text" onChange={handleTagsChange} />
            <label htmlFor="">Binding Method</label>
            <input
              type="text"
              name="binding_method"
              value={formData.binding_method}
              onChange={handleChange}
            />
          </div>
          <div className="detail-card">
            <h2>2. Detail</h2>
            <hr />
            <div className="form-group">
              <div className="text-field">
                <label htmlFor="">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Publisher</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Translator</label>
                <input
                  type="text"
                  name="translator"
                  value={formData.translator}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Page count</label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Publish date (Year)</label>
                <input
                  type="text"
                  name="year_published"
                  value={formData.year_published}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="pricing-image-card">
            <h2>3. Pricing and Pictures</h2>
            <hr />
            <div className="form-group">
              <div className="text-field">
                <label htmlFor="">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Instock</label>
                <input
                  type="number"
                  name="instock"
                  value={formData.instock}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Weight</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Dimensions</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>
              <div className="text-field">
                <label htmlFor="">Product picture</label>
                <input type="file" />
              </div>
            </div>
          </div>
          <div className="description-card">
            <h2>4. Description</h2>
            <hr />
            <label htmlFor="">Product description</label>
            <textarea
              id=""
              cols="30"
              rows="10"
              value={formData.description}
              name="description"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="nav-btn">
            <button type="button" className="btn-cancel">
              <Link to={"/seller/products"}>Cancel</Link>
            </button>
            <button type="submit" className="btn-submit">
              Submit
            </button>
          </div>
        </form>
      </div>
      <FooterComponent />
    </>
  );
};

export default AddProductPage;
