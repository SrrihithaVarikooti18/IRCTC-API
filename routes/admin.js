const express = require('express');
const { addTrain, bookSeat } = require('../controllers/admin'); 
const apiKeyMiddleware = require('../middleware/apiKey');  

const router = express.Router();

router.post('/train', apiKeyMiddleware, addTrain); 

router.post('/train/book', apiKeyMiddleware, bookSeat); 

module.exports = router;
