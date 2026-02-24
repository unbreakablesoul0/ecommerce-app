 import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  const updateCart = (updated) => {
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increaseQty = (index) => {
    const updated = [...cartItems];
    updated[index].quantity += 1;
    updateCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cartItems];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      updateCart(updated);
    }
  };

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <Header />

      <div className="cart-container">
        <h1>Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="empty">Cart is empty</p>
        ) : (
          <>
            <div className="cart-grid">
              {cartItems.map((item, index) => (
                <div className="cart-card" key={index}>
                  <img src={item.thumbnail} alt={item.title} />

                  <h3>{item.title}</h3>
                  <p className="price">₹ {item.price}</p>

                  <div className="qty-box">
                    <button onClick={() => decreaseQty(index)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(index)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <h2 className="total">Total Price: ₹ {totalPrice}</h2>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Cart;
