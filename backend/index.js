import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from 'cors';


import { Payment } from './models/paymentModel.js';

import paymentsRoutes from './routes/paymentsRoute.js';
import paymentExpensesRoute from './routes/paymentExpensesRoute.js'


const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS POLICY
//Option 01: Allow all origins with Default of cors(*)
app.use(cors());

//Option 02: Allow custom origins
/*
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);
*/

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome my project');
});

app.use('/payments', paymentsRoutes);
app.use('/expenses', paymentExpensesRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
      console.log('App connected to database');
      app.listen(PORT, () => {
        console.log(`App is listen to port: ${PORT}`);
    });
  })
  .catch((error) => {
      console.log(error);
  });