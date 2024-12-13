import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VirtualOutfit.css";

const VirtualOutfit = ({ initialProduct, onClose, chatbotRef }) => {
  // State management
  const [preferences, setPreferences] = useState({
    style: "",
    occasion: "",
    colorPreference: "",
    size: "",
  });

  const [outfitSuggestion, setOutfitSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  // Style and occasion options
  const styleOptions = [
    "Casual Athletic",
    "Sports Fan",
    "Street Style",
    "Game Day",
    "Training",
  ];
  const occasionOptions = [
    "Watching Games",
    "Playing Sports",
    "Casual Outings",
    "Team Practice",
    "Fan Events",
  ];

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
    if (field === "style") setStep(1);
    if (field === "occasion") setStep(2);
    if (field === "colorPreference") generateOutfit();
  };

  // Generate outfit suggestion by calling the API
  const generateOutfit = async () => {
    if (!preferences.colorPreference) {
      setError("Please enter a color preference.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API call to fetch outfit suggestion
      const response = await axios.post("/api/outfit-suggestion", {
        baseProduct: initialProduct,
        preferences,
      });

      const suggestion = response.data;
      setOutfitSuggestion(suggestion);

      // Send suggestion to chatbot
      const outfitMessage = createOutfitMessage(suggestion);
      if (chatbotRef.current) {
        chatbotRef.current.addMessage("ai", outfitMessage);
      }
    } catch (error) {
      console.error("Error generating outfit:", error);
      setError(
        "An error occurred while generating the outfit. Please try again."
      );
    } finally {
      setLoading(false);
      setStep(3);
    }
  };

  // Create formatted message for the chatbot
  const createOutfitMessage = (suggestion) => {
    return `
Here's your personalized outfit suggestion:

Base Item: ${suggestion.baseItem.name} - $${suggestion.baseItem.price}

Suggested Items to Complete Your Look:
${suggestion.suggestedItems
  .map(
    (item) =>
      `• ${item.name} - $${item.price}
   ${item.description}`
  )
  .join("\n")}

Total Outfit Cost: $${calculateTotalCost(suggestion)}

Would you like to see any of these items in detail?
    `;
  };

  // Calculate total outfit cost
  const calculateTotalCost = (suggestion) => {
    const basePrice = parseFloat(suggestion.baseItem.price);
    const additionalCosts = suggestion.suggestedItems.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return (basePrice + additionalCosts).toFixed(2);
  };

  // Render the current step in the flow
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="style-selection">
            <h3>Select Your Style</h3>
            <div className="options-grid">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  className={`style-option ${
                    preferences.style === style ? "selected" : ""
                  }`}
                  onClick={() => handlePreferenceChange("style", style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="occasion-selection">
            <h3>Select the Occasion</h3>
            <div className="options-grid">
              {occasionOptions.map((occasion) => (
                <button
                  key={occasion}
                  className={`occasion-option ${
                    preferences.occasion === occasion ? "selected" : ""
                  }`}
                  onClick={() => handlePreferenceChange("occasion", occasion)}
                >
                  {occasion}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="color-preference">
            <h3>Color Preference</h3>
            <input
              type="text"
              placeholder="Enter your color preference"
              value={preferences.colorPreference}
              onChange={(e) =>
                handlePreferenceChange("colorPreference", e.target.value)
              }
              onKeyPress={(e) => e.key === "Enter" && generateOutfit()}
            />
            <button onClick={generateOutfit} disabled={loading}>
              {loading ? "Generating..." : "Generate Outfit"}
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case 3:
        return (
          <div className="outfit-result">
            {loading ? (
              <div className="loading-spinner">
                Generating your perfect outfit...
              </div>
            ) : (
              outfitSuggestion && (
                <div className="outfit-suggestion">
                  <h3>Your Perfect Outfit</h3>
                  <div className="outfit-items">
                    {/* Base Item */}
                    <div className="outfit-item">
                      <img
                        src={outfitSuggestion.baseItem.imageUrl}
                        alt={outfitSuggestion.baseItem.name}
                      />
                      <h4>{outfitSuggestion.baseItem.name}</h4>
                      <p>${outfitSuggestion.baseItem.price}</p>
                    </div>
                    {/* Suggested Items */}
                    {outfitSuggestion.suggestedItems.map((item, index) => (
                      <div key={index} className="outfit-item">
                        <img src={item.imageUrl} alt={item.name} />
                        <h4>{item.name}</h4>
                        <p>${item.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="total-cost">
                    Total Outfit Cost: ${calculateTotalCost(outfitSuggestion)}
                  </div>
                </div>
              )
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="virtual-outfit-container">
      <div className="virtual-outfit-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Create Your Perfect Outfit</h2>
        {renderStep()}
      </div>
    </div>
  );
};

export default VirtualOutfit;
