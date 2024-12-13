import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chatbot from "./Chatbot";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("7"); // Default shoe size
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStartIndex, setCurrentStartIndex] = useState(0); // Tracks the current starting index of visible products
  const [activeFilter, setActiveFilter] = useState(null); // Track the current active filter
  const [backgroundImage, setBackgroundImage] = useState("");
  const [outFilterActive, setOutfitFilterActive] = useState(false); // State for outfit filter activation
  const [userName, setUserName] = useState(null); // State for user name

  const navigate = useNavigate(); // For navigating to CommunityPage
  const productsPerPage = 6; // Show 6 products at a time
  const productsToAddOrRemove = 3; // Number of products to load/remove with each button click
  const chatbotRef = useRef(); // Reference to Chatbot component

  const categoryBackgrounds = {
    Sports: [
      "/images/sports_shoes_1.jpeg",
      "/images/sports_shoes_2.jpeg",
      "/images/sports_shoes_3.jpeg",
      "/images/sports_shoes_4.jpeg",
    ],
    Dress: [
      "/images/dress_shoes_1.jpeg",
      "/images/dress_shoes_2.jpeg",
      "/images/dress_shoes_3.jpeg",
      "/images/dress_shoes_4.jpeg",
    ],
    Casual: [
      "/images/sandals_1.jpeg",
      "/images/sandals_2.jpeg",
      "/images/sandals_3.jpeg",
      "/images/sandals_4.jpeg",
    ],
    Jerseys: [
      "/images/soccer_jersey_1.jpeg",
      "/images/soccer_jersey_2.jpeg",
      "/images/soccer_jersey_3.jpeg",
      "/images/soccer_jersey_4.jpeg",
    ],
    Caps: [
      "/images/baseball_cap_1.jpeg",
      "/images/baseball_cap_2.jpeg",
      "/images/baseball_cap_3.jpeg",
      "/images/baseball_cap_4.jpeg",
    ],
  };

  // Fetch userName form localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data); // Set filtered products to full product list initially
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Image tiles for categories
  const filterTiles = [
    { name: "Sports Shoes", imgSrc: "/images/sports.jpeg", category: "Sports" },
    { name: "Dress Shoes", imgSrc: "/images/dress.jpeg", category: "Dress" },
    { name: "Sandals", imgSrc: "/images/sandal.jpeg", category: "Casual" },
    {
      name: "Soccer Jerseys",
      imgSrc: "/images/soccer_jersey.jpeg",
      category: "Jerseys",
    },
    {
      name: "Baseball Caps",
      imgSrc: "/images/baseball_hat.jpeg",
      category: "Caps",
    },
  ];

  // Function to toggle filter based on tile click
  const toggleFilter = (category) => {
    setOutfitFilterActive(false); // Reset outfit filter if a regular category is clicked
    if (activeFilter === category) {
      // If clicked again, remove the filter
      setFilteredProducts(products);
      setActiveFilter(null);
    } else {
      // Apply the new filter
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
      setActiveFilter(category);
    }
    setCurrentStartIndex(0); // Reset Pagination
  };

  // Handle custom product filtering for outfit suggestions
  useEffect(() => {
    const handleOutfitFilter = (event) => {
      const outfit = event.detail;
      console.log("Received outfit suggestion:", outfit);

      // Create array of product names to filter
      const outfitItems = [
        outfit.cap?.name,
        outfit.jersey?.name,
        outfit.shoes?.name,
      ].filter(Boolean); // Remove null/undefined values

      // Filter products that match any outfit item name
      const filtered = products.filter((product) =>
        outfitItems.includes(product.name)
      );

      if (filtered.length > 0) {
        setFilteredProducts(filtered);
        setOutfitFilterActive(true);
        setCurrentStartIndex(0);
      } else {
        console.warn(
          "No matching products found for outfit items:",
          outfitItems
        );
        setFilteredProducts(products); // Show all products as fallback
      }
    };

    window.addEventListener("filterOutfit", handleOutfitFilter);

    return () => {
      window.removeEventListener("filterOutfit", handleOutfitFilter);
    };
  }, [products]); // Make sure to include products in the dependency array

  // Add an event listener for filtering products
  useEffect(() => {
    const handleFilterProducts = (event) => {
      const category = event.detail;
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered); // Update the state with filtered products
      setCurrentStartIndex(0); // Reset pagination to the beginning
    };

    window.addEventListener("filterProducts", handleFilterProducts);

    return () => {
      window.removeEventListener("filterProducts", handleFilterProducts);
    };
  }, [products]);

  // secondary messages displayed to user
  const aiSecondaryMessages = {
    "Quantum Leap Sports Shoe":
      "These shoes feature advanced cushioning technology and lightweight materials, providing optimal support for high-intensity workouts and long-distance runs. The breathable mesh upper ensures comfort during extended use.",
    "Elegance Evening Dress Shoe":
      "Crafted with premium leather and a cushioned insole, these shoes offer both style and comfort for long evenings. The sleek design pairs well with formal attire, making them perfect for weddings, galas, or business events.",
    "Breeze Comfort Sandals":
      "Featuring a contoured footbed and adjustable straps, these sandals provide personalized comfort for all-day wear. The durable outsole offers excellent traction on various surfaces, making them ideal for both beach outings and city walks.",
    "Cyber X Sneakers":
      "Incorporating smart technology, these sneakers can track your steps, analyze your gait, and connect to your smartphone for personalized fitness insights. The LED accents are not just stylish but also enhance visibility during night runs.",
    "Galaxy Night Heels":
      "These heels feature a cushioned insole and a stable, comfortable heel height, allowing you to dance the night away. The shimmering, galaxy-inspired design catches the light beautifully, ensuring you stand out at any evening event.",
    "Eco-Friendly Sandals":
      "Made from recycled ocean plastics and sustainable materials, these sandals help reduce environmental impact. They feature a contoured footbed for arch support and a grippy outsole for stability on various terrains.",
    "Velocity Boost Runner":
      "Engineered with responsive cushioning technology, these runners provide excellent energy return with each step. The lightweight, breathable upper and reinforced heel counter offer both comfort and stability for high-speed runs.",
    "Classic Oxford Leather Shoes":
      "Handcrafted from full-grain leather, these Oxfords develop a beautiful patina over time. The Goodyear welt construction ensures durability and allows for easy resoling, making these shoes a long-lasting investment in your wardrobe.",
    "Summer Breeze Flip Flops":
      "Designed with a soft, quick-drying footbed and a durable rubber outsole, these flip flops are perfect for beach days or poolside lounging. The ergonomic shape provides arch support for improved comfort during extended wear.",
    "Trailblazer Running Shoe":
      "Featuring a rugged outsole with multi-directional lugs, these shoes offer superior traction on varied terrains. The protective toe cap and reinforced upper provide durability and protection against trail hazards.",
    "Regal Oxford Dress Shoe":
      "Handcrafted with attention to detail, these shoes feature a blake-stitched sole for flexibility and a sleek silhouette. The burnished leather upper adds a touch of sophistication, making them suitable for black-tie events or important business meetings.",
    "Urban Slip-On Loafers":
      "The memory foam insole molds to your foot for personalized comfort, while the elastic goring ensures easy on-and-off. The versatile design transitions seamlessly from casual weekends to relaxed office environments.",
    "Hyperflex Running Shoe":
      "Incorporating cutting-edge flex grooves in the sole, these shoes allow for natural foot movement and improved agility. The knit upper adapts to your foot shape, providing a snug, sock-like fit for enhanced performance.",
    "Executive Derby Shoe":
      "Featuring a subtle pebble grain leather, these Derby shoes offer a sophisticated texture that stands out in professional settings. The cork-filled insole molds to your foot over time, providing increasing comfort with each wear.",
    "Comfy Cloud Slippers":
      "Filled with high-density memory foam, these slippers offer cloud-like comfort for your feet. The non-slip rubber sole provides safety on various indoor surfaces, while the machine-washable design ensures easy maintenance.",
    "European Cup Jersey":
      "Made with moisture-wicking fabric, this jersey keeps you cool even during intense matches. It features the official tournament patch and your team's crest, embroidered for durability.",
    "Home Ground Soccer Jersey":
      "This jersey incorporates the latest in breathable technology, with mesh panels for enhanced ventilation. The vibrant team colors are fade-resistant, ensuring the jersey stays bright wash after wash.",
    "International Friendly Match Jersey":
      "Crafted from recycled polyester, this eco-friendly jersey reduces environmental impact. It features a slim fit design for a modern look, with stretch fabric for unrestricted movement on the field.",
    "Stadium Edition Jersey":
      "This premium jersey includes a chip that can be scanned for exclusive stadium content and offers. The fabric is treated with an anti-odor finish, keeping you fresh throughout the game.",
    "Cup Final Jersey":
      "Featuring gold-threaded detailing to commemorate the final, this jersey is a true collector's item. It's made with a lightweight, quick-dry fabric to keep players comfortable under pressure.",
    "Sunset Beach Cap":
      "This cap features UPF 50+ sun protection and a sweat-wicking headband to keep you cool and protected. The brim is slightly longer for extra shade during those long beach days.",
    "Mountain Climber Cap":
      "Made with ripstop fabric, this cap is resistant to tears and abrasions. It features a hidden zippered pocket in the crown, perfect for storing small valuables during your climb.",
    "Summer Breeze Cap":
      "This cap incorporates ventilated mesh panels and moisture-wicking fabric to keep your head cool. The adjustable back closure ensures a comfortable fit for all head sizes.",
    "Sports Performance Cap":
      "Featuring an aerodynamic design, this cap reduces wind resistance during high-speed activities. The bill is reinforced to maintain its shape, and the cap includes reflective elements for visibility in low light.",
    "All-Star Baseball Cap":
      "This cap showcases embroidered patches of all participating teams. It's made with the same performance fabric used by pro players, ensuring authentic on-field quality.",
    "Classic Snapback Cap":
      "The six-panel construction and green undervisor pay homage to traditional cap design. The snapback closure allows for easy size adjustment, making it a one-size-fits-most option.",
    "Retro Sports Cap":
      "This cap features a worn-in look achieved through a special washing process. The embroidered vintage team logo is based on designs from the team's early years.",
    "Urban Streetwear Cap":
      "The flat brim can be curved to your preference, and the cap features a hidden pocket in the sweatband. The understated design includes tonal stitching for a sleek, modern look.",
    "Adventure Explorer Cap":
      "This cap includes a fold-down neck flap for extra sun protection during outdoor expeditions. It's treated with insect repellent and features quick-dry properties for comfort in various conditions.",
    "Minimalist Black Cap":
      "Crafted from a single piece of fabric for a seamless look, this cap represents the epitome of minimalist design. The matte black hardware adds to its understated elegance.",
  };

  // Function to send a custom message to the AI chatbox based on product click
  const sendProductClickToAI = (product) => {
    const aiMessages = {
      "Quantum Leap Sports Shoe":
        "You clicked on the Quantum Leap Sports Shoe. This is one of our top-selling sports shoes known for its high-performance design. Would you like to know more or add it to your cart?",
      "Elegance Evening Dress Shoe":
        "You clicked on the Elegance Evening Dress Shoe. This shoe combines sophistication and style, perfect for any formal occasion. Would you like more details or add it to your cart?",
      "Breeze Comfort Sandals":
        "You clicked on the Breeze Comfort Sandals. Designed for ultimate comfort and style, these sandals are perfect for casual days out. Would you like to know more or add it to your cart?",
      "Cyber X Sneakers":
        "You clicked on the Cyber X Sneakers. These cutting-edge sneakers offer both comfort and futuristic design. Would you like to know more or add them to your cart?",
      "Galaxy Night Heels":
        "You clicked on the Galaxy Night Heels. Shine under the stars with these elegant heels, perfect for evening wear. Would you like more information or add them to your cart?",
      "Eco-Friendly Sandals":
        "You clicked on the Eco-Friendly Sandals. Crafted from recycled materials, these sandals provide comfort with a sustainable twist. Would you like to know more or add them to your cart?",
      "Velocity Boost Runner":
        "You clicked on the Velocity Boost Runner. Built for speed and agility, these runners are a must for athletes. Would you like more details or add them to your cart?",
      "Classic Oxford Leather Shoes":
        "You clicked on the Classic Oxford Leather Shoes. These timeless shoes are crafted from premium leather for any formal setting. Would you like more details or add them to your cart?",
      "Summer Breeze Flip Flops":
        "You clicked on the Summer Breeze Flip Flops. Ideal for beach days or relaxing strolls, these flip flops bring comfort and style. Would you like to know more or add them to your cart?",
      "Trailblazer Running Shoes":
        "You clicked on the Trailblazer Running Shoe. Perfect for trail running, these shoes provide excellent grip and durability. Would you like more details or add them to your cart?",
      "Regal Oxford Dress Shoe":
        "You clicked on the Regal Oxford Dress Shoe. These shoes feature a luxurious design, ideal for making a strong formal impression. Would you like more details or add them to your cart?",
      "Urban Slip-On Loafers":
        "You clicked on the Urban Slip-On Loafers. Easy to wear and stylish, these loafers are perfect for everyday casual looks. Would you like to know more or add them to your cart?",
      "Hyperflex Running Shoe":
        "You clicked on the Hyperflex Running Shoe. Offering flexibility and support, these shoes are built for high-performance workouts. Would you like to know more or add them to your cart?",
      "Executive Derby Shoe":
        "You clicked on the Executive Derby Shoe. These sleek derby shoes are designed for a professional and polished look. Would you like more details or add them to your cart?",
      "Comfy Cloud Slippers":
        "You clicked on the Comfy Cloud Slippers. Made for relaxation, these slippers offer the ultimate comfort for lounging. Would you like to know more or add them to your cart?",
      "Blazing Fast Runner":
        "You clicked on the Blazing Fast Runner. Designed for speed and agility, this shoe will elevate your running game. Would you like more details or add it to your cart?",
      "Royal Elegance Loafers":
        "You clicked on the Royal Elegance Loafers. These luxury loafers blend comfort and sophistication for formal occasions. Would you like more information or add them to your cart?",
      "Sunny Day Slip Ons":
        "You clicked on the Sunny Day Slip Ons. Perfect for summer days, these slip-ons offer both comfort and style. Would you like more details or add them to your cart?",
      // Custom Dress Boot Messages
      "Majestic Leather Boots":
        "You clicked on the Majestic Leather Boots. These premium leather boots offer a timeless and elegant look. Would you like more details or add them to your cart?",
      "Noble Suede Chelsea Boots":
        "You clicked on the Noble Suede Chelsea Boots. Crafted with suede, these Chelsea boots are perfect for both casual and formal outfits. Would you like to know more or add them to your cart?",
      "Royal Black Ankle Boots":
        "You clicked on the Royal Black Ankle Boots. Sleek and stylish, these boots are ideal for any occasion. Would you like more details or add them to your cart?",
      "Imperial Wingtip Boots":
        "You clicked on the Imperial Wingtip Boots. These boots offer a classic wingtip design, perfect for making a statement. Would you like to know more or add them to your cart?",
      "Crown Leather Chukka Boots":
        "You clicked on the Crown Leather Chukka Boots. Crafted from premium leather, these boots provide durability and style. Would you like more information or add them to your cart?",
      "Luxury Leather Boots":
        "You clicked on the Luxury Leather Boots. These boots are crafted from high-quality leather and are perfect for both formal and casual occasions. Would you like to know more or add them to your cart?",
      "Urban Trek Boots":
        "You clicked on the Urban Trek Boots. Designed for the city adventurer, these boots provide both style and comfort for all-day wear. Would you like to know more or add them to your cart?",
      "Classic Suede Chelsea Boots":
        "You clicked on the Classic Suede Chelsea Boots. Known for their sleek and timeless design, these boots are a wardrobe staple for any stylish individual. Would you like to know more or add them to your cart?",
      "Premium Lace-Up Ankle Boots":
        "You clicked on the Premium Lace-Up Ankle Boots. Featuring a rugged yet sophisticated design, these ankle boots are perfect for any formal or semi-formal occasion. Would you like to know more or add them to your cart?",
      "Executive Leather Dress Boots":
        "You clicked on the Executive Leather Dress Boots. These boots combine luxury and comfort, making them ideal for business or evening attire. Would you like to know more or add them to your cart?",
      // Custom Sports Shoe Messages
      "Turbo Sprint Sneakers":
        "You clicked on the Turbo Sprint Sneakers. Built for speed, these sneakers are perfect for sprinters and high-performance athletes. Would you like more details or add them to your cart?",
      "Lightning Strike Runners":
        "You clicked on the Lightning Strike Runners. These runners provide lightning-fast speed with enhanced grip and support. Would you like more details or add them to your cart?",
      "Speed Demon Athletic Shoes":
        "You clicked on the Speed Demon Athletic Shoes. Designed for fast movements and agility, these shoes are ideal for high-speed activities. Would you like to know more or add them to your cart?",
      "Peak Performance Trainers":
        "You clicked on the Peak Performance Trainers. These trainers are built for maximum performance and endurance. Would you like more details or add them to your cart?",
      "Power Surge Running Shoes":
        "You clicked on the Power Surge Running Shoes. Offering advanced support and cushioning, these running shoes are perfect for long runs. Would you like more details or add them to your cart?",
      "Cyclone Flex Sneakers":
        "You clicked on the Cyclone Flex Sneakers. These sneakers provide flexibility and comfort, ideal for all-day wear. Would you like more details or add them to your cart?",
      "Endurance Pro Runners":
        "You clicked on the Endurance Pro Runners. Built for endurance athletes, these runners offer long-lasting comfort and durability. Would you like more details or add them to your cart?",
      "Ultra Speed Track Shoes":
        "You clicked on the Ultra Speed Track Shoes. Designed for track athletes, these shoes offer speed and agility. Would you like more information or add them to your cart?",
      "Rapid Runner Trainers":
        "You clicked on the Rapid Runner Trainers. These trainers provide a lightweight feel with superior support. Would you like more details or add them to your cart?",
      "Vortex Velocity Sneakers":
        "You clicked on the Vortex Velocity Sneakers. These sneakers are engineered for speed and agility, perfect for athletes. Would you like to know more or add them to your cart?",
      "Speedster Elite Sneakers":
        "You clicked on the Speedster Elite Sneakers. High-performance sneakers designed for elite athletes. Would you like more details or add them to your cart?",
      "Vortex Pro Trail Shoes":
        "You clicked on the Vortex Pro Trail Shoes. Designed for challenging trails, these shoes offer superior grip and durability. Would you like more details or add them to your cart?",
      "Blaze Runner XT Shoes":
        "You clicked on the Blaze Runner XT Shoes. Built for extreme conditions, these shoes provide excellent traction and support. Would you like to know more or add them to your cart?",
      "Velocity Surge Sneakers":
        "You clicked on the Velocity Surge Sneakers. These sneakers combine speed and comfort for the ultimate running experience. Would you like more details or add them to your cart?",
      "Lightning Strike Sneakers":
        "You clicked on the Lightning Strike Sneakers. These sneakers are built for speed with a lightweight design and superior grip. Would you like to know more or add them to your cart?",
      "Thunderbolt Trail Runners":
        "You clicked on the Thunderbolt Trail Runners. These trail runners offer unmatched traction and durability on rough terrain. Would you like to know more or add them to your cart?",
      "Volt High Performance Runners":
        "You clicked on the Volt High Performance Runners. These shoes are designed for athletes seeking speed and endurance. Would you like to know more or add them to your cart?",
      "Turbo Charge Athletic Shoes":
        "You clicked on the Turbo Charge Athletic Shoes. These athletic shoes feature advanced cushioning and support for high-impact workouts. Would you like to know more or add them to your cart?",
      "Falcon Pro Running Shoes":
        "You clicked on the Falcon Pro Running Shoes. Run with the speed of a falcon in these lightweight and flexible running shoes. Would you like to know more or add them to your cart?",
      "Eagle Glide Sport Shoes":
        "You clicked on the Eagle Glide Sport Shoes. These sleek and aerodynamic sport shoes boost your performance and agility. Would you like to know more or add them to your cart?",
      "Aero Sprint Sneakers":
        "You clicked on the Aero Sprint Sneakers. These sneakers are designed for sprinters, offering superior speed and support. Would you like to know more or add them to your cart?",
      "Flash Energy Runners":
        "You clicked on the Flash Energy Runners. These energy-returning runners provide dynamic cushioning for long-distance comfort. Would you like to know more or add them to your cart?",
      "Power Surge Training Shoes":
        "You clicked on the Power Surge Training Shoes. These shoes offer unmatched support for high-performance training sessions. Would you like to know more or add them to your cart?",
      "Dyno Force Running Shoes":
        "You clicked on the Dyno Force Running Shoes. These shoes are designed for endurance, offering both comfort and power for long-distance runners. Would you like to know more or add them to your cart?",
      "Phoenix High Flyer Sneakers":
        "You clicked on the Phoenix High Flyer Sneakers. Lightweight and agile, these sneakers are built for speed and flexibility. Would you like to know more or add them to your cart?",
      "Zephyr Sprint Shoes":
        "You clicked on the Zephyr Sprint Shoes. These ultra-light, aerodynamic sprint shoes are perfect for fast runners. Would you like to know more or add them to your cart?",
      "Raptor XT Running Shoes":
        "You clicked on the Raptor XT Running Shoes. Built for rugged trails, these running shoes are designed for high-speed pursuits in tough conditions. Would you like to know more or add them to your cart?",
      // Now adding the soccer jerseys
      "European Cup Jersey":
        "You clicked on the European Cup Jersey. Celebrate the European Cup with this official jersey. Would you like more details or add it to your cart?",
      "Home Ground Soccer Jersey":
        "You clicked on the Home Ground Soccer Jersey. Show your team pride with this official home ground jersey. Would you like more details or add it to your cart?",
      "International Friendly Match Jersey":
        "You clicked on the International Friendly Match Jersey. Represent your team during international friendly matches. Would you like more information or add it to your cart?",
      "Stadium Edition Jersey":
        "You clicked on the Stadium Edition Jersey. This exclusive jersey is perfect for stadium events. Would you like to know more or add it to your cart?",
      "Cup Final Jersey":
        "You clicked on the Cup Final Jersey. Celebrate the cup final with this official team jersey. Would you like more details or add it to your cart?",
      "Street Soccer Training Jersey":
        "You clicked on the Street Soccer Training Jersey. Lightweight and perfect for fast-paced games. Would you like more details or add it to your cart?",
      "Classic Football Jersey":
        "You clicked on the Classic Football Jersey. Retro-style with a timeless design. Would you like to know more or add it to your cart?",
      "Soccer Club Away Jersey":
        "You clicked on the Soccer Club Away Jersey. Official away jersey for the team. Would you like more details or add it to your cart?",
      "Fan Edition Soccer Jersey":
        "You clicked on the Fan Edition Soccer Jersey. Show your support with this edition! Would you like more information or add it to your cart?",
      "Training Ground Jersey":
        "You clicked on the Training Ground Jersey. High-performance jersey for serious training. Would you like to know more or add it to your cart?",
      "Champions League Home Jersey":
        "You clicked on the Champions League Home Jersey. Get ready for the season with this official jersey. Would you like more information or add it to your cart?",
      "National Team Away Jersey":
        "You clicked on the National Team Away Jersey. Represent your team in style. Would you like more details or add it to your cart?",
      "Premier League Club Jersey":
        "You clicked on the Premier League Club Jersey. Support your favorite team with this replica. Would you like more information or add it to your cart?",
      "World Cup Limited Edition Jersey":
        "You clicked on the World Cup Limited Edition Jersey. Limited edition jersey for the ultimate fan. Would you like to know more or add it to your cart?",
      "Team Captain Jersey":
        "You clicked on the Team Captain Jersey. Jersey worn by the team captain. Would you like more details or add it to your cart?",
      "Soccer World Tour Jersey":
        "You clicked on the Soccer World Tour Jersey. Exclusive design for the world tour. Would you like to know more or add it to your cart?",
      "All-Star Match Jersey":
        "You clicked on the All-Star Match Jersey. Worn during the all-star match. Would you like more information or add it to your cart?",
      "Supporters' Club Jersey":
        "You clicked on the Supporters' Club Jersey. Designed for the true supporters. Would you like more details or add it to your cart?",
      // Added the Baseball Caps
      "Sunset Beach Cap":
        "You clicked on the Sunset Beach Cap. Perfect for a day at the beach, this cap offers style and sun protection. Would you like more details or add it to your cart?",
      "Mountain Climber Cap":
        "You clicked on the Mountain Climber Cap. This durable cap is designed for outdoor enthusiasts. Would you like to know more or add it to your cart?",
      "Summer Breeze Cap":
        "You clicked on the Summer Breeze Cap. Stay cool with this breathable summer cap. Would you like more details or add it to your cart?",
      "Sports Performance Cap":
        "You clicked on the Sports Performance Cap. Designed for athletes, this cap offers comfort during intense training. Would you like more information or add it to your cart?",
      "All-Star Baseball Cap":
        "You clicked on the All-Star Baseball Cap. Celebrate the all-star season with this exclusive cap. Would you like more details or add it to your cart?",
      "Classic Snapback Cap":
        "You clicked on the Classic Snapback Cap. A timeless snapback cap perfect for everyday wear. Would you like more details or add it to your cart?",
      "Retro Sports Cap":
        "You clicked on the Retro Sports Cap. This vintage-inspired cap brings back old-school sports style. Would you like to know more or add it to your cart?",
      "Urban Streetwear Cap":
        "You clicked on the Urban Streetwear Cap. A stylish cap that complements any streetwear outfit. Would you like more details or add it to your cart?",
      "Adventure Explorer Cap":
        "You clicked on the Adventure Explorer Cap. Designed for rugged outdoor adventures, this cap is perfect for explorers. Would you like more information or add it to your cart?",
      "Minimalist Black Cap":
        "You clicked on the Minimalist Black Cap. Sleek and simple, this cap is perfect for a minimalistic style. Would you like more details or add it to your cart?",
      "Baseball Fan Cap":
        "You clicked on the Baseball Fan Cap. Show your love for the game with this classic baseball cap. Would you like to know more or add it to your cart?",
      "Trucker Mesh Cap":
        "You clicked on the Trucker Mesh Cap. Breathable and perfect for warm weather, this cap is a must-have. Would you like more details or add it to your cart?",
      "Bold Logo Cap":
        "You clicked on the Bold Logo Cap. Featuring a bold logo, this cap is for those who love making a statement. Would you like to know more or add it to your cart?",
      "Camouflage Hunter Cap":
        "You clicked on the Camouflage Hunter Cap. Ideal for outdoor enthusiasts, this camo cap blends into nature. Would you like more information or add it to your cart?",
      "Vintage Washed Cap":
        "You clicked on the Vintage Washed Cap. With a soft, worn-in feel, this cap offers a classic, vintage look. Would you like to know more or add it to your cart?",
      "Championship Baseball Cap":
        "You clicked on the Championship Baseball Cap. Celebrate your team's victory with this special edition cap. Would you like more details or add it to your cart?",
      "Hall of Fame Cap":
        "You clicked on the Hall of Fame Cap. Pay homage to the greats with this commemorative cap. Would you like to know more or add it to your cart?",
    };

    const message = aiMessages[product.name];

    if (message) {
      window.dispatchEvent(
        new CustomEvent("productClickAI", { detail: message })
      );
      chatbotRef.current.openChat(); // Make sure to open the chat each time a product is clicked
    }
  };

  // Function to handle user interaction when asking for more details
  const handleUserInputForDetails = (productName) => {
    const secondaryMessage = aiSecondaryMessages[productName];
    console.log("Attempting to dispatch secondary message:", secondaryMessage); // Debugging
    if (secondaryMessage) {
      window.dispatchEvent(
        new CustomEvent("productClickAI", { detail: secondaryMessage })
      );
      chatbotRef.current.openChat(); // Open the chat if user asks for more details
    } else {
      console.log("No secondary message found for:", productName); // Debugging
    }
  };

  const handleReviewClick = (product) => {
    setSelectedProduct(product); // Save selected product in the component state
    navigate("/community", { state: { selectedProduct: product } }); // Navigate to CommunityPage and pass product
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedSize("7");
    sendProductClickToAI(product);
    console.log("Clicked product:", product.name);
    if (chatbotRef.current) {
      chatbotRef.current.setLastClickedProduct(product.name);
    }
    // Change background based on the product category
    changeBackground(product.category);
  };

  const changeBackground = (category) => {
    console.log("Changing background for category:", category); // Debugging line
    const images = categoryBackgrounds[category] || [];
    if (images.length > 0) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setBackgroundImage("url(" + randomImage + ")");
    } else {
      console.warn("No images found for category:", category); // Debugging line
    }
  };

  useEffect(() => {
    const handleChatboxClose = () => {
      chatbotRef.current.clearMessages(); // Ensure all messages are cleared
    };

    window.addEventListener("closeChatbox", handleChatboxClose);
    return () => {
      window.removeEventListener("closeChatbox", handleChatboxClose);
    };
  }, []);

  // Handle loading more products (next 3)
  const loadMoreProducts = () => {
    if (currentStartIndex + productsPerPage < filteredProducts.length) {
      setCurrentStartIndex(currentStartIndex + productsToAddOrRemove);
    }
  };

  // Handle loading previous products (previous 3)
  const loadPreviousProducts = () => {
    if (currentStartIndex > 0) {
      setCurrentStartIndex(currentStartIndex - productsToAddOrRemove);
    }
  };

  // Get the current set of products to display
  const currentProducts = filteredProducts.slice(
    currentStartIndex,
    currentStartIndex + productsPerPage
  );

  const addToCart = (product, size) => {
    setCart([...cart, { ...product, size }]);
    alert(`Added ${product.name} size ${size} to cart!`);
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="product-list"
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Display Welcome Message */}
      {userName && <div className="welcome-message">Welcome, {userName}!</div>}
      {/* Filter Tiles Section */}
      <div className="filter-tiles">
        {filterTiles.map((tile) => (
          <div
            key={tile.name}
            className={`filter-tile ${
              activeFilter === tile.category ? "active" : ""
            }`}
            onClick={() => toggleFilter(tile.category)}
          >
            <div className="image-wrapper">
              <img src={tile.imgSrc} alt={tile.name} className="filter-image" />
            </div>
            <span>{tile.name}</span>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div className="products">
        {currentProducts.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
            <button onClick={() => handleReviewClick(product)}>
              Write Review
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {currentStartIndex > 0 && (
          <button onClick={loadPreviousProducts}>Load Previous</button>
        )}
        {currentStartIndex + productsPerPage < filteredProducts.length && (
          <button onClick={loadMoreProducts}>Load More</button>
        )}
      </div>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div
          className="modal open"
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50%",
            padding: "20px",
            backgroundColor: "white",
            overflowY: "auto",
            maxHeight: "80vh",
            zIndex: 100,
          }}
        >
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <h2>
            {selectedProduct.name} - ${selectedProduct.price.toFixed(2)}
          </h2>
          <p>{selectedProduct.description}</p>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {["7", "8", "9", "10", "11", "12"].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button onClick={() => setSelectedProduct(null)}>Close</button>
          <button
            onClick={() => addToCart(selectedProduct, selectedSize)}
            style={{ marginLeft: "10px" }}
          >
            Add to Cart
          </button>
        </div>
      )}

      {/* Chatbot Component */}
      <Chatbot
        ref={chatbotRef}
        handleUserInputForDetails={handleUserInputForDetails}
      />
    </div>
  );
}

export default ProductList;
