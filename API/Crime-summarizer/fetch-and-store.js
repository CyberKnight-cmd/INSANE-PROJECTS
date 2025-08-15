// in fetch-and-store.js

const fs = require('fs/promises'); // Use the promise-based version of the file system module
const path = require('path');

// Import our services
const locationService = require('./services/locationService');
const crimeApiService = require('./services/crimeApiService');

// Define the path to our storage file
const CRIME_STORAGE_PATH = path.join(__dirname, 'storage', 'crimes.json');

// This is the main function that runs the entire process.
async function fetchAndStoreData() {
  console.log('--- Starting Data Fetching Process ---');

  try {
    // Step 1: Define the target area. In a real app, this might come from user input.
    const targetArea = 'New York City, NY';
    
    // Step 2: Use our locationService to get coordinates for the area.
    // (Currently, this returns fake data, which is perfect for testing).
    const locationData = await locationService.getLocationData(targetArea);
    console.log(`Successfully got location data for: ${locationData.name}`);

    // Step 3: Use our crimeApiService to fetch bulk crime data for that location.
    // (Currently, this also returns our fake data, which proves the flow works).
    const rawCrimeData = await crimeApiService.fetchBulkCrimeData(locationData);
    
    if (!rawCrimeData || rawCrimeData.length === 0) {
      console.log('No crime data returned from the API. Aborting.');
      return;
    }

    console.log(`Fetched a total of ${rawCrimeData.length} crime records.`);

    // Step 4: Prepare the data for storage. We'll save it in a nicely formatted way.
    // JSON.stringify(data, null, 2) makes the JSON file human-readable with indentation.
    const dataToStore = JSON.stringify(rawCrimeData, null, 2);

    // Step 5: Write the data to our crimes.json file, overwriting whatever is there.
    await fs.writeFile(CRIME_STORAGE_PATH, dataToStore);
    
    console.log(`\n✅ Success! Data has been written to: ${CRIME_STORAGE_PATH}`);

  } catch (error) {
    console.error('\n❌ An error occurred during the data fetching process:', error);
  } finally {
    console.log('--- Data Fetching Process Finished ---');
  }
}

// Run the main function.
fetchAndStoreData();