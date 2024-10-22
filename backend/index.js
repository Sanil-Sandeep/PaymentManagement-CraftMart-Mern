import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from 'cors';



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