const fs = require('fs');
const path = require('path');

const TRAINING_DATA_PATH = path.join(__dirname, '..', 'data', 'training_data.json');

// In-memory cache for training data
let trainingData = [];

// Load existing training data from file
function loadTrainingData() {
  try {
    if (fs.existsSync(TRAINING_DATA_PATH)) {
      const data = fs.readFileSync(TRAINING_DATA_PATH, 'utf8');
      trainingData = JSON.parse(data);
      console.log(`Loaded ${trainingData.length} training samples.`);
    }
  } catch (error) {
    console.error('Error loading training data:', error);
  }
}

// Save training data to file
function saveTrainingData() {
  try {
    fs.writeFileSync(TRAINING_DATA_PATH, JSON.stringify(trainingData, null, 2));
    console.log(`Saved ${trainingData.length} training samples.`);
  } catch (error) {
    console.error('Error saving training data:', error);
  }
}

// Simulate fetching real-time data
async function getCrimeData(latitude, longitude) {
    console.log(`Fetching crime data for location: (${latitude}, ${longitude})`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return { crimeRate: Math.random() * 10 };
}

async function getLightingData(latitude, longitude) {
    console.log(`Fetching lighting data for location: (${latitude}, ${longitude})`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { lightingLevel: Math.random() };
}

async function getWeatherData(latitude, longitude) {
    console.log(`Fetching weather data for location: (${latitude}, ${longitude})`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { condition: 'Clear', temperature: 25, precipitation: 0 };
}

async function getTrafficData(latitude, longitude) {
    console.log(`Fetching traffic data for location: (${latitude}, ${longitude})`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { density: Math.random(), congestion: false };
}

async function getEmergencyResponseData(latitude, longitude) {
    console.log(`Fetching emergency response data for location: (${latitude}, ${longitude})`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { responseTime: Math.random() * 30 };
}

async function collectAllData(locations) {
    const allData = [];
    for (const location of locations) {
        const [latitude, longitude] = location;
        const data = {
            location: { latitude, longitude },
            crime: await getCrimeData(latitude, longitude),
            lighting: await getLightingData(latitude, longitude),
            weather: await getWeatherData(latitude, longitude),
            traffic: await getTrafficData(latitude, longitude),
            emergency: await getEmergencyResponseData(latitude, longitude),
        };
        allData.push(data);
    }
    return allData;
}

// Initial load of training data
loadTrainingData();

module.exports = {
    collectAllData,
    trainingData,
    loadTrainingData,
    saveTrainingData,
};