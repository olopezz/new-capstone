import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import AdminPanel from "./components/AdminPanel";
import LoginRegisterPage from "./components/LoginRegisterPage";
import CommunityPage from "./components/CommunityPage"; // Import the Community page
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartModal from "./components/CartModal";
import Chatbot from "./components/Chatbot";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Add selected product state

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateCart = (product, amount) => {
    if (product.quantity + amount <= 0) {
      setCart(cart.filter((item) => item.id !== product.id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: product.quantity + amount }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
    <Router>
      <Chatbot /> {/* This will render the Chatbot on all pages */}
      <Header /> {/* Add Header for navigation */}
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/products"
          element={
            <PageWrapper>
              <ProductList
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
              />
            </PageWrapper>
          }
        />
        <Route
          path="/admin"
          element={
            <PageWrapper>
              <AdminPanel />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <LoginRegisterPage />
            </PageWrapper>
          }
        />
        <Route
          path="/community"
          element={
            <PageWrapper>
              <CommunityPage selectedProduct={selectedProduct} />
            </PageWrapper>
          }
        />
        {/* Add additional routes as necessary */}
      </Routes>
      {isCartVisible && (
        <CartModal
          cart={cart}
          updateCart={updateCart}
          removeFromCart={removeFromCart}
          closeCart={toggleCart}
        />
      )}
      <Footer />
    </Router>
  );
}

export default App;
