const Train = require('../models/Train');
const Booking = require('../models/Booking');

exports.addTrain = async (req, res) => {
    const { name, source, destination, totalSeats } = req.body;

    try {
        const newTrain = await Train.create({
            name,
            source,
            destination,
            totalSeats,
            availableSeats: totalSeats,  
        });

        res.status(201).json(newTrain); 
    } catch (error) {
        console.error('Error adding train:', error.message);
        res.status(500).json({ error: 'Failed to add train' });
    }
};

exports.bookSeat = async (req, res) => {
  const { trainId, userId } = req.body;  
  console.log("Received booking request:", { trainId, userId });

  try {
    
      const train = await Train.findByPk(trainId);
      console.log("Train found:", train);

      if (!train) {
          return res.status(404).json({ error: 'Train not found' });
      }

      if (train.availableSeats <= 0) {
          return res.status(400).json({ error: 'No seats available' });
      }

      const booking = await Booking.create({
          userId, 
          trainId,
          seatCount: 1 
      });

      console.log("Booking created:", booking);

      await train.decrement('availableSeats', { by: 1 });

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
