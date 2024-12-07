const express = require('express');
const sequelize = require('./config/db'); // Import the Sequelize instance
const adminRoutes = require('./routes/admin'); // Import the admin routes
const userRoutes = require('./routes/user'); // Import the user routes

const app = express();

// Middleware
app.use(express.json());

// Sync Sequelize Models with Database
sequelize.sync({ force: false }) // Set `force: true` for development if you want to recreate tables
    .then(() => {
        console.log('Database & tables synced successfully!');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

// Use the routes
app.use('/admin', adminRoutes);  // Mount admin routes at /admin
app.use('/user', userRoutes);    // Mount user routes at /user

// Start the Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
