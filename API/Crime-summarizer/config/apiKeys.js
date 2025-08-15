// in config/apiKeys.js
require('dotenv').config();

module.exports = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  crimeDataApiKey: process.env.CRIME_DATA_API_KEY,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
};