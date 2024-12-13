import React from 'react';

function CartModal({ cart, updateCart, removeFromCart, closeCart }) {
  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);
  };

  return (
    <div className="cart-modal">
      <div className="cart-content">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: 'auto' }} />
              <div>
                <h4>{item.name}</h4>
                <p>${item.price} x {item.quantity}</p>
                <button onClick={() => updateCart(item, 1)}>+</button>
                <button onClick={() => updateCart(item, -1)}>-</button>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))
        )}
        <div className="total">
          <h3>Total: ${getTotalPrice()}</h3>
        </div>
        <button onClick={closeCart} className="close-btn">Close Cart</button>
      </div>
      <div className="backdrop" onClick={closeCart}></div>
    </div>
  );
}

export default CartModal;

