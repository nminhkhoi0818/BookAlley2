import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { addNewReview } from "../actions/reviewsAction";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const AddReviewComponent = ({ product_id, isOpen, closeModal }) => {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewImage, setReviewImage] = useState();
  const dispatch = useDispatch();

  function afterOpenModal() {}

  const handleReviewContent = (e) => {
    setReviewContent(e.target.value);
  };

  const handleSendReview = () => {
    dispatch(
      addNewReview({
        product_id: product_id,
        content: reviewContent,
        rating: rating,
        images: reviewImage,
      })
    );
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReviewImage(e.target.files);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onAfterClose={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <form action="" className="form-review">
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= (hover || rating) ? "on" : "off"}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
          <h3>Share your review</h3>
          <label htmlFor="review-content"></label>
          <textarea
            name="review-content"
            id=""
            cols="30"
            value={reviewContent}
            onChange={handleReviewContent}
            rows="10"
            style={{
              width: "500px",
              outline: "none",
              fontFamily: "inherit",
            }}
          ></textarea>
          <label htmlFor="review-images"></label>
          <input
            type="file"
            onChange={onImageChange}
            multiple
            accept="image/png, image/jpeg"
          />
          <button type="button" className="send-btn" onClick={handleSendReview}>
            Send review
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AddReviewComponent;
