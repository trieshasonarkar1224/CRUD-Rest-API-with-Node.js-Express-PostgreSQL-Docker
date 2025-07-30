// Reference: https://www.youtube.com/watch?v=H9M02of22z4&t=5431s&ab_channel=DipeshMalvia

// Install Express
// Install nodemon so server will restart on change
// Install dotenv so we can access .env variables through process.env

// Import
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config(); // So we can read from our .env file using process.env

connectDb(); // Connect to the database

// Make the app as an Express app
const app = express();

// Define PORT in .env file
const port = process.env.PORT || 5000;

// Establish our middleware
app.use(express.json()); // For parsing JSON from data stream from client
app.use('/api/contacts', require('./routes/contactRoutes')); // For Contact HTTP requests
app.use('/api/users', require('./routes/userRoutes')); // For authentication
app.use(errorHandler);  // For parsing thrown errors into JSON

// Make the app listen on the port that we created
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});

// HTTP client for testing (Thunder Client extension in VS Code) by sending requests to http://localhost:<port>