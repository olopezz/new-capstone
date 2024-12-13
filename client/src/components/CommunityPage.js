import React, { useState, useEffect } from "react";
import axios from "axios";
import NewReviewForm from "./NewReviewForm";
import ProductReview from "./ProductReview";
import "./CommunityPage.css";
import { useLocation } from "react-router-dom";

const CommunityPage = () => {
  const location = useLocation();
  const initialProduct = location.state?.selectedProduct || null;

  // State variables
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [draftReview, setDraftReview] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [reviewStyle, setReviewStyle] = useState("casual");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Fetch reviews from the server
  const fetchReviews = async () => {
    try {
      console.log("Fetching reviews from /api/reviews...");
      const response = await axios.get("/api/reviews");
      console.log("Fetched reviews:", response.data);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setFeedback("Failed to load reviews. Please try again later.");
    }
  };

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Enhance the review using AI
  const enhanceReview = async () => {
    if (!selectedProduct || !draftReview.trim()) {
      console.log(
        "Enhance Review: No product selected or review text is empty."
      );
      setFeedback(
        "Please select a product and write a review before getting suggestions."
      );
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request to /api/reviews/enhance-review...");
      const response = await axios.post("/api/reviews/enhance-review", {
        review: draftReview,
        style: reviewStyle,
        productType: selectedProduct?.category,
      });
      console.log("AI Suggestions received:", response.data);
      setAiSuggestions(response.data.suggestions || []);
      setFeedback(
        "AI suggestions generated. Select one to refine your review!"
      );
    } catch (error) {
      console.error("Error getting AI suggestions:", error);

      // Provide specific feedback based on the error
      if (error.response?.status === 404) {
        setFeedback("Enhancement route not found. Please check server setup.");
      } else if (error.response?.status === 500) {
        setFeedback("AI service encountered an error. Please try again later.");
      } else {
        setFeedback("Couldn't get AI suggestions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit the review to the server
  const submitReview = async () => {
    if (!selectedProduct || !draftReview.trim()) {
      console.log(
        "Submit Review: No product selected or review text is empty."
      );
      setFeedback(
        "Please select a product and write a review before submitting."
      );
      return;
    }

    try {
      console.log("Submitting review to /api/reviews...");
      await axios.post("/api/reviews", {
        productId: selectedProduct._id,
        review: draftReview,
        userId: "current-user-id", // Replace with actual user ID logic
        rating: 5, // Replace with dynamic user input if needed
        date: new Date(),
      });
      console.log("Review submitted successfully!");
      setDraftReview("");
      setSelectedProduct(null);
      setAiSuggestions([]);
      setFeedback("Review submitted successfully!");
      await fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      setFeedback("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community Reviews</h1>
        <p>Share your thoughts and experiences with our products</p>
      </div>

      {/* Display feedback message */}
      {feedback && <div className="feedback-message">{feedback}</div>}

      <div className="review-section">
        {selectedProduct ? (
          <NewReviewForm
            selectedProduct={selectedProduct}
            draftReview={draftReview}
            setDraftReview={setDraftReview}
            reviewStyle={reviewStyle}
            setReviewStyle={(style) => {
              console.log("Review style set to:", style);
              setReviewStyle(style);
            }}
            enhanceReview={enhanceReview}
            submitReview={submitReview}
            loading={loading}
            aiSuggestions={aiSuggestions}
          />
        ) : (
          <div className="select-product-prompt">
            Select a product from the product page to write a review.
          </div>
        )}
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <ProductReview key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
