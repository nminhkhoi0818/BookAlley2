import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductReview } from "../actions/reviewsAction";
import ReviewCardComponent from "./ReviewCardComponent";

const ReviewsComponent = ({ product_id }) => {
  const dispatch = useDispatch();
  const { loading, error, reviews } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getProductReview({ product_id: product_id }));
  }, []);

  return (
    <div className="customer-reviews">
      <h2>Reviews</h2>
      {reviews &&
        reviews.map((review) => {
          return <ReviewCardComponent key={review._id} review={review} />;
        })}
    </div>
  );
};

export default ReviewsComponent;
