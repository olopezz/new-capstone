const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const { Configuration, OpenAIApi } = require("openai");

// Configure OpenAI
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this key is in your .env file
});
const openai = new OpenAIApi(openaiConfig);

// GET all reviews
router.get("/", async (req, res) => {
  try {
    // Populate product details for each review
    const reviews = await Review.find().populate("productId", "name imageUrl");
    res.json(reviews);
  } catch (err) {
    console.error("Error retrieving reviews:", err);
    res.status(500).send("Error retrieving reviews: " + err.message);
  }
});

// POST a new review
router.post("/", async (req, res) => {
  try {
    const { productId, review, userId, rating, date } = req.body;

    // Validate request data
    if (!productId || !review || !userId || !rating || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate that the productId exists in the products collection
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        error: "Product not found. Please provide a valid productId.",
      });
    }

    // Create and save the review
    const newReview = new Review({ productId, review, userId, rating, date });
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(400).send("Error saving review: " + err.message);
  }
});

// POST to enhance a review using AI
router.post("/enhance-review", async (req, res) => {
  const { review, style, productType } = req.body;

  // Validate request data
  if (!review || !style || !productType) {
    return res.status(400).json({
      error: "Review text, style, and product type are required.",
    });
  }

  try {
    console.log("Sending request to OpenAI for review enhancement...");

    // Call OpenAI API to rewrite the review
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Replace with "gpt-4" if accessible
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that rewrites reviews in a specific tone: casual or professional.",
        },
        {
          role: "user",
          content: `Rewrite the following review in a ${style} style for a product in the category of ${productType}:\n\n"${review}"`,
        },
      ],
      max_tokens: 150,
    });

    // Extract suggestions from OpenAI response
    const suggestions = response.data.choices.map((choice) =>
      choice.message.content.trim()
    );

    res.status(200).json({ suggestions });
    console.log("AI suggestions generated successfully.");
  } catch (err) {
    console.error("Error enhancing review with OpenAI:", err.message);
    res
      .status(500)
      .json({ error: "Failed to enhance review. Please try again later." });
  }
});

module.exports = router;
