import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/BackButton';
import Spinner from '../../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import visaImg from '../../../components/images/visa.png';
import masterImg from '../../../components/images/master.png'; 
import { useSnackbar } from 'notistack';
import Header from '../../../components/headerfooter/Header';
import Footer from '../../../components/headerfooter/Footer';

function EditPayment() {
//const [paymentID, setPaymentID] = useState('');
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
const {id} = useParams();
const { enqueueSnackbar } = useSnackbar();

useEffect(() => {
  setLoading(true);
  axios.get(`http://localhost:5555/payments/${id}`)
  .then((response) => {
    setProductName(response.data.productName.join('\n'));
    setPrice(response.data.price.join('\n'))
    setQuantity(response.data.quantity.join('\n'))
    setTotalPrice(response.data.totalPrice)
    setCardHolderName(response.data.cardHolderName)
    setCardNumber(response.data.cardNumber)
    setCvv(response.data.cvv)
    setEmail(response.data.email)
    setLoading(false);
  }).catch((error) => {
    setLoading(false);
    alert('An error happend. Please check console');
    console.log(error);
  });
}, [])



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
  }  //else if (!/^[a-zA-Z]+@gmail\.com$/.test(email)) {
    //newErrors.email = 'Email must contain only letters before @gmail.com.';
    //}

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
    newErrors.cardNumber = `Card number must start with ${
      cardType === 'visa' ? '4' : '51-55'
    }.`;
  }

  if (!cvv) {
    newErrors.cvv = 'CVV is required.';
  } else if (!/^\d{3}$/.test(cvv)) {
    newErrors.cvv = 'CVV must be 3 digits.';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleEditPayment = () => {

  if (!validateForm()) {
    return;
  }

  const data = {
  //paymentID,
    productName: productName.split('\n'), // Split product names into array
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
    .put(`http://localhost:5555/payments/${id}`, data)
    .then(() => {
      setLoading(false);
      enqueueSnackbar('Payment details edited successfully', { variant: 'success' });
      navigate(`/payments/details/${id}`);
    })
    .catch((error) => {
      setLoading(false);
    //alert('An error occurred. Please check the console.');
      enqueueSnackbar('Error', { variant: 'error' });
      console.log(error);
    })
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

return (
  

export default EditPayment;
