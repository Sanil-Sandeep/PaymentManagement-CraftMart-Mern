import React, { useState, useEffect } from 'react';
import { getCart, saveCart } from "../Cart/utils/cart";
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleRemoveItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    saveCart(newCart);
  };

  const handleBuyNow = () => {
    // Pass cart items to CreatePayments page
    navigate('/payments/create', { state: { cartItems } });
  };

  const goToHome = () => {
    navigate('/products/card'); // This navigates to the home page
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (cartItems.length === 0) {
    return <div className="text-center p-8">Your cart is empty</div>;
  }

  

export default CartPage;
