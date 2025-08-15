// in app.js

// This line loads the environment variables (like your API keys and PORT) from the .env file
require('dotenv').config();

// This line imports the Express framework, which is the foundation of our API
const express = require('express');
const cors = require('cors');

// This imports the routes we defined in crimeRoutes.js
const crimeRoutes = require('./routes/crimeRoutes');

// This line creates an instance of the Express application
const app = express();

// Enable CORS for all routes
app.use(cors());

// This line defines the port number our server will listen on.
// It will first try to use the PORT from your .env file, or default to 3001 if it's not found.
const PORT = process.env.PORT || 3001;

// This is a simple "health check" route. If you visit the main URL, it will show that the API is running.
app.get('/', (req, res) => {
  res.send('Crime Summarizer API is running successfully!');
});

// This tells our Express app to use the crimeRoutes for any URL that starts with '/api'.
// So, our route '/crimes' will become '/api/crimes'.
app.use('/api', crimeRoutes);


// This line starts the server and makes it listen for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Crime Summarizer API is running on port ${PORT}`);
});