// routes/outfit.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Ensure this points to your Product schema/model

// POST /api/outfit-suggestion
router.post("/api/outfit-suggestion", async (req, res) => {
  const { baseProduct, preferences } = req.body;

  try {
    // Step 1: Find the base product from the database
    const mainProduct = await Product.findById(baseProduct.id);

    // Step 2: Query the database to find matching items based on preferences
    const outfitItems = await Product.find({
      category: { $in: ["Cap", "Jersey", "Shoes"] },
      style: preferences.style,
      occasion: preferences.occasion,
      color: preferences.colorPreference,
    }).limit(3); // Adjust limit based on desired output

    // Step 3: Prepare the response with the selected items
    const outfitSuggestion = {
      baseItem: mainProduct,
      suggestedItems: outfitItems,
      totalPrice: outfitItems.reduce((sum, item) => sum + item.price, mainProduct.price),
    };

    res.status(200).json(outfitSuggestion);
  } catch (error) {
    console.error("Error generating outfit suggestion:", error);
    res.status(500).json({ error: "Failed to generate outfit suggestion" });
  }
});

module.exports = router;

