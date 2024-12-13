import React from "react";

const NewReviewForm = ({
  selectedProduct,
  draftReview,
  setDraftReview,
  reviewStyle,
  setReviewStyle,
  enhanceReview,
  submitReview,
  loading,
  aiSuggestions,
}) => (
  <div className="review-form">
    <div className="selected-product">
      <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
      <h3>{selectedProduct.name}</h3>
    </div>

    <div className="review-style-toggle">
      <button
        className={reviewStyle === "casual" ? "active" : ""}
        onClick={() => setReviewStyle("casual")}
      >
        Casual Style
      </button>
      <button
        className={reviewStyle === "professional" ? "active" : ""}
        onClick={() => setReviewStyle("professional")}
      >
        Professional Style
      </button>
    </div>

    <textarea
      value={draftReview}
      onChange={(e) => setDraftReview(e.target.value)}
      placeholder="Write your review here..."
      rows={5}
    />

    <button onClick={enhanceReview} disabled={!draftReview.trim() || loading}>
      Get AI Suggestions
    </button>

    {loading && <div className="loading-spinner">Getting AI suggestions...</div>}

    {aiSuggestions && aiSuggestions.length > 0 && (
      <div className="ai-suggestions">
        <h4>AI Enhanced Versions:</h4>
        {aiSuggestions.map((suggestion, index) => (
          <div key={index} className="suggestion">
            <p>{suggestion}</p>
            <button onClick={() => setDraftReview(suggestion)}>
              Use This Version
            </button>
          </div>
        ))}
      </div>
    )}

    <button className="submit-review" onClick={submitReview} disabled={!draftReview.trim()}>
      Submit Review
    </button>
  </div>
);

export default NewReviewForm;

