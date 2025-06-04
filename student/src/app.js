// app.js (Make sure this is default export)

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const courseRoutes = require('./routes/courses');
const { data } = require('react-router-dom');

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON bodies

// Routes
app.use('/api/courses', courseRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(data => {
    console.log(data);
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

module.exports = app; // <-- Ensure you're exporting the app
