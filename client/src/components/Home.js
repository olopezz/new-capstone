import React, { useState } from "react";
import Slider from "react-slick";
import Header from "./Header"; // Make sure to import the Header component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [showHeader, setShowHeader] = useState(false); // State to control Header visibility

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div>
      {/* Pass the state as a prop to the Header */}
      {showHeader && <Header show={showHeader} />}

      <div
        className="hero-section"
        style={{
          padding: "50px 0",
          textAlign: "center",
          backgroundColor: "rgba(47, 79, 79, 0.8)",
          color: "var(--primary-text-color)",
          position: "relative", // Ensures proper stacking context for absolute positioning
          zIndex: 1, // Ensures it's above the animated background but below the dropdown
        }}
      >
        <h1>Welcome to Our Online Store</h1>
        <p>Discover unique items from independent creators</p>
        <button
          onClick={() => setShowHeader(!showHeader)}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            fontSize: "18px",
            backgroundColor: "#00ffcc", // Bright, attention-grabbing button color
            color: "black", // Text color for contrast
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 2, // Ensure the button is above the hero section content
          }}
        >
          Explore Now
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        <h2>Featured Products</h2>
        <Slider {...settings}>
          <div>
            <img src="/images/sports.jpeg" alt="Sports Equipment" />
          </div>
          <div>
            <img src="/images/dress.jpeg" alt="Evening Dress" />
          </div>
          <div>
            <img src="/images/sandal.jpeg" alt="Comfortable Sandals" />
          </div>
          <div>
            <img src="/images/soccer_jersey.jpeg" alt="Soccer Jersey" />{" "}
            {/* New Image */}
          </div>
          <div>
            <img src="/images/baseball_hat.jpeg" alt="Baseball Hat" />{" "}
            {/* New Image */}
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Home;
