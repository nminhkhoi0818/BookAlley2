import React from "react";
import moment from "moment";

const ReviewCardComponent = ({ review }) => {
  return (
    <>
      <div className="review-card">
        <div className="user-info">
          <img src={review.user.avatar} alt="" />
          <div className="info-right">
            <h4>{review.user.username}</h4>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={index <= review.rating ? "on" : "off"}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p className="date">
          {moment(review.created_at).format("MMMM Do YYYY, h:mm:ss a")}
        </p>
        <p className="content">{review.content}</p>
        {review.images.map((image) => {
          return <img key={image} src={image} alt="" width="100px" />;
        })}
      </div>
      <hr />
    </>
  );
};

export default ReviewCardComponent;
