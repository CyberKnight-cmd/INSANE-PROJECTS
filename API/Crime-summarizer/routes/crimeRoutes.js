// in routes/crimeRoutes.js

const express = require('express');
const router = express.Router();

// This line imports the controller we just created.
// It gives this file access to the 'getCrimes' function.
const crimeController = require('../controllers/crimeController');

// This line sets up the main route.
// It tells the application: "When a web browser or client sends a GET request
// to the URL '/crimes', execute the 'getCrimes' function from our controller."
router.get('/crimes', crimeController.getCrimes);

// This line makes the router we've configured available to other parts of our
// application, specifically to our main 'app.js' file.
module.exports = router;