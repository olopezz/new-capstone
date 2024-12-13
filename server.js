require("dotenv").config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const express = require("express");
const path = require("path");
const connectDB = require("./client/config/database");
const productsRoutes = require("./routes/products");
const outfitRoutes = require("./routes/outfit");
const reviewsRoutes = require("./routes/reviews"); // Import the reviews routes
const usersRoutes = require("./routes/users"); // Import the users routes
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();

// Increase the maximum header size limit for JSON and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Enable CORS
app.use(cors());

// Use the authentication routes
app.use("/api/users", usersRoutes);

// Connect to MongoDB
connectDB();

// Routes for products, outfit suggestions, and reviews
app.use("/api/products", productsRoutes);
app.use("/api/outfit", outfitRoutes); // Ensure '/api/outfit' prefix for consistency
app.use("/api/reviews", reviewsRoutes); // Add the '/api/reviews' route

// Initialize OpenAI API configuration
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is in the .env file
});
const openai = new OpenAIApi(openaiConfig);

// Add AI response route with product filtering logic
app.post("/api/ai-response", async (req, res) => {
  const { message } = req.body;

  // Check for specific commands related to product filtering
  if (message.toLowerCase().includes("sports shoes")) {
    return res.json({ response: "Filtering to show only sports shoes." });
  } else if (message.toLowerCase().includes("dress shoes")) {
    return res.json({ response: "Filtering to show only dress shoes." });
  } else if (message.toLowerCase().includes("casual shoes")) {
    return res.json({ response: "Filtering to show only casual shoes." });
  } else if (message.toLowerCase().includes("sandals")) {
    return res.json({ response: "Filtering to show only sandals." });
  } else if (message.toLowerCase().includes("soccer jerseys")) {
    return res.json({ response: "Filtering to show only soccer jerseys." });
  } else if (message.toLowerCase().includes("baseball caps")) {
    return res.json({ response: "Filtering to show only baseball caps." });
  }

  // If no specific command is found, process the request with OpenAI
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Use GPT-4 if accessible
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
    });

    res.json({ response: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(
      "Error with OpenAI API:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error processing AI response" });
  }
});

// Serve React app in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build"))); // Ensures correct path usage

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
