const express = require('express');
const { register, login, bookSeat, getAvailability ,getBookingDetails} = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/book', authMiddleware, bookSeat);
router.get('/availability', authMiddleware, getAvailability);
router.get('/booking/:bookingId', authMiddleware, getBookingDetails);

module.exports = router;
