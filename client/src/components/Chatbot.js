import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastClickedProduct, setLastClickedProduct] = useState(null);
  const [key, setKey] = useState(0);
  const [stylingMode, setStylingMode] = useState(false);
  const [stylingPreferences, setStylingPreferences] = useState({
    style: null,
    occasion: null,
    colorPreference: null,
  });
  const [outfitSuggestion, setOutfitSuggestion] = useState(null);

  const stylingPrompts = {
    initial:
      "Would you like me to help create a complete outfit with this item? I can suggest matching pieces that would work well together.",
    style:
      "What style are you going for? Choose from: Casual Athletic, Sports Fan, Street Style, Game Day, or Training.",
    occasion:
      "What's the occasion? Choose from: Watching Games, Playing Sports, Casual Outings, Team Practice, or Fan Events.",
    colorPreference:
      "Do you have any color preferences? This will help me create a more personalized outfit.",
    processing: "Great choices! Let me put together an outfit for you...",
  };

  const clearAllMessages = () => {
    setMessages([]);
    setLastClickedProduct(null);
    setInput("");
    setLoading(false);
    setStylingMode(false);
    setStylingPreferences({
      style: null,
      occasion: null,
      colorPreference: null,
    });
    setOutfitSuggestion(null);
    setKey((prevKey) => prevKey + 1);
  };

  const toggleChat = () => {
    setIsOpen((prevState) => {
      if (prevState) {
        window.dispatchEvent(new CustomEvent("clearChatMessages"));
        clearAllMessages();
      }
      return !prevState;
    });
  };

  const handleInputChange = (e) => setInput(e.target.value);

  useImperativeHandle(ref, () => ({
    openChat() {
      if (!isOpen) {
        setIsOpen(true);
      }
    },
    setLastClickedProduct(productName) {
      console.log("Setting last clicked product:", productName);
      setLastClickedProduct(productName);
    },
    clearAllMessages,
    startStylingSession(product) {
      setIsOpen(true);
      setLastClickedProduct(product);
      setStylingMode(true);
      addMessage("ai", stylingPrompts.initial);
    },
  }));

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const handleStylingResponse = async (userInput) => {
    if (!stylingPreferences.style) {
      setStylingPreferences({ ...stylingPreferences, style: userInput });
      addMessage("ai", stylingPrompts.occasion);
    } else if (!stylingPreferences.occasion) {
      setStylingPreferences({ ...stylingPreferences, occasion: userInput });
      addMessage("ai", stylingPrompts.colorPreference);
    } else if (!stylingPreferences.colorPreference) {
      setStylingPreferences({
        ...stylingPreferences,
        colorPreference: userInput,
      });
      addMessage("ai", stylingPrompts.processing);
      await generateOutfitSuggestion();
    }
  };

  const generateOutfitSuggestion = async () => {
    setLoading(true);
    try {
      // Create outfit suggestion based on style and occasion
      const suggestion = {
        cap: null,
        jersey: null,
        shoes: null,
      };

      // Match outfit items based on style preference
      switch (stylingPreferences.style) {
        case "Sports Fan":
        case "Game Day":
          suggestion.cap = { name: "Sports Performance Cap", price: 29.99 };
          suggestion.jersey = {
            name: "Champions League Home Jersey",
            price: 89.99,
          };
          suggestion.shoes = {
            name: "Quantum Leap Sports Shoe",
            price: 119.99,
          };
          break;

        case "Casual Athletic":
          suggestion.cap = { name: "Classic Snapback Cap", price: 29.99 };
          suggestion.jersey = {
            name: "Home Ground Soccer Jersey",
            price: 79.99,
          };
          suggestion.shoes = {
            name: "Speed Demon Athletic Shoes",
            price: 109.99,
          };
          break;

        case "Street Style":
          suggestion.cap = { name: "Urban Streetwear Cap", price: 34.99 };
          suggestion.jersey = {
            name: "Street Soccer Training Jersey",
            price: 69.99,
          };
          suggestion.shoes = { name: "Cyber X Sneakers", price: 129.99 };
          break;

        case "Training":
          suggestion.cap = { name: "Performance Sports Cap", price: 24.99 };
          suggestion.jersey = { name: "Training Ground Jersey", price: 59.99 };
          suggestion.shoes = { name: "Velocity Boost Runner", price: 139.99 };
          break;

        default:
          suggestion.cap = { name: "Classic Snapback Cap", price: 29.99 };
          suggestion.jersey = {
            name: "Champions League Home Jersey",
            price: 89.99,
          };
          suggestion.shoes = {
            name: "Quantum Leap Sports Shoe",
            price: 119.99,
          };
      }

      setOutfitSuggestion(suggestion);

      // Create detailed message for user
      const outfitMessage = `
  Based on your preferences:
  Style: ${stylingPreferences.style}
  Occasion: ${stylingPreferences.occasion}
  Color Preference: ${stylingPreferences.colorPreference || "Any"}
  
  Here's what I suggest for your outfit:
  
  🧢 ${suggestion.cap.name} - $${suggestion.cap.price}
  👕 ${suggestion.jersey.name} - $${suggestion.jersey.price}
  👟 ${suggestion.shoes.name} - $${suggestion.shoes.price}
  
  Total Outfit Cost: $${(
    suggestion.cap.price +
    suggestion.jersey.price +
    suggestion.shoes.price
  ).toFixed(2)}
  
  I've filtered the products to show you these items. Would you like to see any of them in detail?
  `;

      addMessage("ai", outfitMessage);

      // Dispatch event to filter products
      window.dispatchEvent(
        new CustomEvent("filterOutfit", {
          detail: suggestion,
        })
      );

      setStylingMode(false);
    } catch (error) {
      console.error("Error generating outfit:", error);
      addMessage(
        "ai",
        "I apologize, but I'm having trouble creating an outfit suggestion. Would you like to try again?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      if (stylingMode) {
        await handleStylingResponse(input);
        return;
      }

      if (
        input.toLowerCase() === "yes" &&
        lastClickedProduct &&
        messages.some((msg) => msg.text.includes(stylingPrompts.initial))
      ) {
        setStylingMode(true);
        addMessage("ai", stylingPrompts.style);
        return;
      }

      if (
        lastClickedProduct &&
        (input.toLowerCase().includes("more details") ||
          input.toLowerCase().includes("tell me more") ||
          input.toLowerCase().includes("more about") ||
          input.toLowerCase().includes("additional information") ||
          input.toLowerCase().includes("learn more"))
      ) {
        console.log("Triggering secondary message for:", lastClickedProduct);
        props.handleUserInputForDetails(lastClickedProduct);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.post("/api/ai-response", {
          message: input,
        });

        const aiMessage = { sender: "ai", text: response.data.response };
        setMessages((prev) => [...prev, aiMessage]);

        const lowerCaseResponse = aiMessage.text.toLowerCase();
        if (lowerCaseResponse.includes("sports shoes")) {
          filterProducts("Sports");
        } else if (lowerCaseResponse.includes("dress shoes")) {
          filterProducts("Dress");
        } else if (lowerCaseResponse.includes("sandals")) {
          filterProducts("Casual");
        } else if (lowerCaseResponse.includes("soccer jerseys")) {
          filterProducts("Jerseys");
        } else if (lowerCaseResponse.includes("baseball caps")) {
          filterProducts("Caps");
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage = {
          sender: "ai",
          text: "Sorry, I couldn't process your request.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  const filterProducts = (category) => {
    window.dispatchEvent(
      new CustomEvent("filterProducts", { detail: category })
    );
  };

  useEffect(() => {
    const handleAIResponseForProductClick = (event) => {
      const productMessage = event.detail;
      console.log("Displaying message in chatbox:", productMessage);
      const aiMessage = { sender: "ai", text: productMessage };
      setMessages((prev) => [...prev, aiMessage]);

      const outfitPrompt = {
        sender: "ai",
        text: stylingPrompts.initial,
      };
      setMessages((prev) => [...prev, outfitPrompt]);

      setIsOpen(true);
    };

    const handleClearMessages = () => {
      clearAllMessages();
    };

    window.addEventListener("productClickAI", handleAIResponseForProductClick);
    window.addEventListener("clearChatMessages", handleClearMessages);

    return () => {
      window.removeEventListener(
        "productClickAI",
        handleAIResponseForProductClick
      );
      window.removeEventListener("clearChatMessages", handleClearMessages);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderStylingOptions = () => {
    if (!stylingMode) return null;

    const getOptions = () => {
      if (!stylingPreferences.style) {
        return [
          "Casual Athletic",
          "Sports Fan",
          "Street Style",
          "Game Day",
          "Training",
        ];
      }
      if (!stylingPreferences.occasion) {
        return [
          "Watching Games",
          "Playing Sports",
          "Casual Outings",
          "Team Practice",
          "Fan Events",
        ];
      }
      return null;
    };

    const options = getOptions();
    if (!options) return null;

    return (
      <div className="styling-options">
        <div className="style-buttons">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                setInput(option);
                handleSendMessage();
              }}
              className="style-option-button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="chatbot-container">
      <img
        src="/images/chatai.JPG"
        alt="Chatbot"
        onClick={toggleChat}
        style={{
          cursor: "pointer",
          position: "fixed",
          bottom: "20px",
          left: "20px",
        }}
      />
      {isOpen && (
        <div className="chatbox" key={key}>
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user-message" : "ai-message"
                } ${stylingMode ? "styling" : ""}`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="message ai-message loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          {renderStylingOptions()}
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={
                stylingMode
                  ? "Tell me your preference..."
                  : "Ask me anything..."
              }
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Chatbot;
