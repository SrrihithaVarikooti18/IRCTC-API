require('dotenv').config(); // Load environment variables
const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Use 'postgres', 'sqlite', etc., if necessary
    port: process.env.DB_PORT, // Ensure this matches your database configuration
});

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize; // Export the initialized Sequelize instance
