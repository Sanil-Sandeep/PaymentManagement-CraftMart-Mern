import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/BackButton';
import Spinner from '../../../components/Spinner';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import visaImg from '../../../components/images/visa.png';
import masterImg from '../../../components/images/master.png';
import { useSnackbar } from 'notistack';
import Header from '../../../components/headerfooter/Header'
import Footer from '../../../components/headerfooter/Footer'

function CreatePayments() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [cardType, setCardType] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  useEffect(() => {
    if (cartItems.length > 0) {
      // Concatenate all product names, prices, and quantities from the cart
      const productNames = cartItems.map(item => item.productName).join('\n');
      const prices = cartItems.map(item => item.price).join('\n');
      const quantities = cartItems.map(item => item.quantity).join('\n');

      setProductName(productNames);
      setPrice(prices);
      setQuantity(quantities);

      // Calculate total price for all items
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
      //const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setTotalPrice(total);
    }
  }, [cartItems]);

  const validateForm = () => {
    const newErrors = {};

    if (!productName) {
      newErrors.productName = 'Product name is required.';
    }

    if (!price) {
      newErrors.price = 'Price is required.';
    }

    if (!quantity) {
      newErrors.quantity = 'Quantity is required.';
    }

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!email.endsWith('@gmail.com')) {
      newErrors.email = 'Email must end with @gmail.com.';
    }

    if (!cardType) {
      newErrors.cardType = 'Please select a card type.';
    }

    if (!cardHolderName) {
      newErrors.cardHolderName = 'Card holder name is required.';
    } else if (!/\s/.test(cardHolderName)) {
      newErrors.cardHolderName = 'Card holder name must be more than one word.';
    } else if (/\d/.test(cardHolderName)) {
      newErrors.cardHolderName = 'Card holder name must not contain numbers.';
    }

    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required.';
    } else if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    } else if (
      (cardType === 'visa' && !/^4/.test(cardNumber)) ||
      (cardType === 'master' && !/^(51|52|53|54|55)/.test(cardNumber))
    ) {
      newErrors.cardNumber = `Card number must start with ${cardType === 'visa' ? '4' : '51-55'}.`;
    }

    if (!cvv) {
      newErrors.cvv = 'CVV is required.';
    } else if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePayment = () => {
    if (!validateForm()) {
      return;
    }

    const data = {
      productName: productName.split('\n'), // Split the concatenated product names into an array
      price: price.split('\n').map(Number), // Split and convert prices to numbers
      quantity: quantity.split('\n').map(Number), // Split and convert quantities to numbers
      totalPrice,
      cardHolderName,
      cardNumber,
      cvv,
      email,
    };
    setLoading(true);
    axios
      .post('http://localhost:5555/payments', data)
      .then((response) => {
        setLoading(false);
        enqueueSnackbar('Payment created successfully', { variant: 'success' });

        // Redirect to the ShowPayment page with the newly created payment's ID
        const newPaymentId = response.data._id; // Assuming the backend returns the new payment's ID
        navigate(`/payments/details/${newPaymentId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    // Ensure only numbers are typed
    if (/^\d*$/.test(value)) {
      setCardNumber(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    // Ensure only numbers are typed
    if (/^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handleCardHolderNameChange = (e) => {
    const value = e.target.value;
    // Ensure only letters and spaces are typed
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setCardHolderName(value);
    }
  };

  


export default CreatePayments;
