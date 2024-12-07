const express = require('express');
const { addTrain, bookSeat } = require('../controllers/admin'); // Importing admin controller functions
const apiKeyMiddleware = require('../middleware/apiKey');  // API Key Middleware to authenticate admin

const router = express.Router();

// Admin route to add a train
router.post('/train', apiKeyMiddleware, addTrain); // Add train to the database

// Admin route to book a seat on a train and update seat availability
router.post('/train/book', apiKeyMiddleware, bookSeat); // Book seat and update available seats

module.exports = router;
