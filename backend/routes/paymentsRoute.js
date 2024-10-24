import express from 'express';
import { Payment } from '../models/paymentModel.js';

const router = express.Router();

//Route for save a payment
router.post("/", async (request, response) => {
  try {
    if (
      /*!request.body.paymentID ||*/
      !request.body.productName ||
      !request.body.price ||
      !request.body.quantity ||
      !request.body.totalPrice ||
      !request.body.cardHolderName ||
      !request.body.cardNumber ||
      !request.body.cvv ||
      !request.body.email
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: paymentID, productName, price, quantity, totalPrice, cardHolderName, cardNumber, cvv, email",
      });
    }
    const newPayment = {
    //paymentID: request.body.paymentID,
      productName: request.body.productName,
      price: request.body.price,
      quantity: request.body.quantity,
      totalPrice: request.body.totalPrice,
      cardHolderName: request.body.cardHolderName,
      cardNumber: request.body.cardNumber,
      cvv: request.body.cvv,
      email: request.body.email,
    };

    const payment = await Payment.create(newPayment);

    return response.status(201).send(payment);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});




export default router;
