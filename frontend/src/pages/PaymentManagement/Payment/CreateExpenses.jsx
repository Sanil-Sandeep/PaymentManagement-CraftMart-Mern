import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/BackButton';
import Spinner from '../../../components/Spinner';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Header from '../../../components/headerfooter/Header'
import Footer from '../../../components/headerfooter/Footer'

function CreateExpenses() {
  const [eID, seteID] = useState('');
  const [name, setName] = useState('');
  const [expense, setExpense] = useState('');
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


  


export default CreateExpenses;
