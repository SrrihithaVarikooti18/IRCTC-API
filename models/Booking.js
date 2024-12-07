const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const User = require('./User'); 
const Train = require('./Train'); 

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

Booking.belongsTo(User, { foreignKey: 'userId' });  
Booking.belongsTo(Train, { foreignKey: 'trainId' });  

module.exports = Booking;
