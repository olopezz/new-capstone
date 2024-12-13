import React from "react";

const ProductReview = ({ review }) => (
  <div className="review-card">
    <div className="review-header">
      <img src={review.product.imageUrl} alt={review.product.name} />
      <div className="review-meta">
        <h4>{review.product.name}</h4>
        <div className="review-rating">
          {[...Array(review.rating)].map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div>
        <span>{new Date(review.date).toLocaleDateString()}</span>
      </div>
    </div>
    <p className="review-content">{review.review}</p>
  </div>
);

export default ProductReview;

