const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure sequelize is properly imported
const User = require('./User'); // Import User model
const Train = require('./Train'); // Import Train model

const Booking = sequelize.define('Booking', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    trainId: {
        type: DataTypes.INTEGER,
        references: {
            model: Train,
            key: 'id',
        },
        allowNull: false,
    },
    seatCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
});

// Define relationships
Booking.belongsTo(User, { foreignKey: 'userId' });  // Establish relationship with User
Booking.belongsTo(Train, { foreignKey: 'trainId' });  // Establish relationship with Train

module.exports = Booking;
