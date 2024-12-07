const Train = require('../models/Train');
const Booking = require('../models/Booking');

// Function to add a new train to the database
exports.addTrain = async (req, res) => {
    const { name, source, destination, totalSeats } = req.body;

    try {
        const newTrain = await Train.create({
            name,
            source,
            destination,
            totalSeats,
            availableSeats: totalSeats,  // Initial available seats = total seats
        });

        res.status(201).json(newTrain); // Send back the newly created train
    } catch (error) {
        console.error('Error adding train:', error.message);
        res.status(500).json({ error: 'Failed to add train' });
    }
};

// Function to book a seat on a train and update the available seat count
exports.bookSeat = async (req, res) => {
  const { trainId, userId } = req.body;  // Get trainId and userId from the body
  console.log("Received booking request:", { trainId, userId });

  try {
      // Step 1: Find the train by trainId
      const train = await Train.findByPk(trainId);
      console.log("Train found:", train);

      if (!train) {
          return res.status(404).json({ error: 'Train not found' });
      }

      // Step 2: Check if there are available seats
      if (train.availableSeats <= 0) {
          return res.status(400).json({ error: 'No seats available' });
      }

      // Step 3: Create a booking record
      const booking = await Booking.create({
          userId, // Admin can specify the userId for the booking
          trainId,
          seatCount: 1 // Assuming 1 seat is booked per request
      });

      console.log("Booking created:", booking);

      // Step 4: Decrement availableSeats for the train
      await train.decrement('availableSeats', { by: 1 });

      // Step 5: Return the response
      res.status(201).json({
          message: 'Seat booked successfully',
          booking,
          train: {
              name: train.name,
              source: train.source,
              destination: train.destination,
              availableSeats: train.availableSeats,
          }
      });
  } catch (error) {
      console.error('Error booking seat:', error.message);
      res.status(500).json({ error: 'Failed to book seat' });
  }
};