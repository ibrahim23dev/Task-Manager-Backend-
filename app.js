// Basic Lib Import
const express = require('express');
const app = new express();
const router=require('./Src/Routes/api')
// Security Middleware Lib Import
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const mongoose = require('mongoose');

// Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: '50mb' }));

// Body Parser Implement
app.use(express.urlencoded({ extended: true }));

// Request Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

//Connect Database
const mongoDBURI = 'mongodb+srv://Task:task222@cluster0.u0bl180.mongodb.net/CR';

(async () => {
  try {
    await mongoose.connect(mongoDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected Successful to mogoose!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

// Routing Implement
app.use("/api/v1", router);

// Undefined Route Implement
app.use("*", (req, res) => {
    res.status(404).json({ status: "fail", data: "Not Found" });
});

module.exports = app;
