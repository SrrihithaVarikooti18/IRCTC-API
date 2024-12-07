const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Train = require('../models/Train');
const Booking = require('../models/Booking');

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.bookSeat = async (req, res) => {
  const { trainId, seatCount } = req.body;
  const userId = req.user.id;  // Assuming the user is authenticated and `req.user` contains the user's info

  if (!trainId) {
      return res.status(400).json({ error: 'Train ID is required' });
  }

  if (!seatCount || seatCount <= 0) {
      return res.status(400).json({ error: 'A valid number of seats is required' });
  }

  try {
      // Check if the train exists
      const train = await Train.findByPk(trainId);
      if (!train) {
          return res.status(404).json({ error: 'Train not found' });
      }

      // Check if there are enough available seats
      if (train.availableSeats < seatCount) {
          return res.status(400).json({ error: `Only ${train.availableSeats} seats available on this train` });
      }

      // Create booking
      const booking = await Booking.create({
          userId,
          trainId,
          seatCount, // Booking the specified number of seats
      });

      // Decrease available seats
      await train.decrement('availableSeats', { by: seatCount });

      res.status(201).json(booking);
  } catch (error) {
      console.error('Error booking seat:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAvailability = async (req, res) => {
  try {
      const { source, destination } = req.query;

      if (!source || !destination) {
          return res.status(400).json({ message: "Source and destination are required." });
      }

      // Query the database
      const trains = await Train.findAll({
          where: {
              source,
              destination,
          }
      });

      if (!trains.length) {
          return res.status(404).json({ message: "No trains found for the given route." });
      }

      res.status(200).json(trains);
  } catch (error) {
      console.error('Error fetching availability:', error.message);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;

  try {
      const booking = await Booking.findByPk(bookingId, {
          include: {
              model: Train, // Include related train details
              attributes: ['name', 'source', 'destination'],
          },
      });

      if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json({
          bookingId: booking.id,
          userId: booking.userId,
          train: booking.Train,
          seatCount: booking.seatCount,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
      });
  } catch (error) {
      console.error('Error fetching booking details:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getBookingDetails = async (req, res) => {
  const { bookingId } = req.params; // Get bookingId from the URL parameters

  try {
      // Fetch the booking by its ID, including related train details
      const booking = await Booking.findByPk(bookingId, {
          include: {
              model: Train, // Include the Train model to get train details
              attributes: ['name', 'source', 'destination', 'totalSeats', 'availableSeats'], // Specify which train fields to include
          },
      });

      // If the booking is not found, return an error message
      if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
      }

      // Return the booking details along with the related train information
      res.status(200).json({
          bookingId: booking.id,
          userId: booking.userId,
          train: booking.Train, // This will include the train's name, source, destination, etc.
          seatCount: booking.seatCount,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
      });
  } catch (error) {
      // Handle any errors and send a generic message
      console.error('Error fetching booking details:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
};

