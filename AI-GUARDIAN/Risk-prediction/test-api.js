/**
 * Test script for the Risk Prediction API
 * Run with: node test-api.js
 */

const axios = require('axios');

// API endpoint
const API_URL = 'http://localhost:5000/api';

// Test data
const testRoutes = [
  {
    name: 'Downtown Route',
    data: {
      start: '37.7749,-122.4194', // San Francisco downtown
      end: '37.7849,-122.4094',   // North Beach area
      mode: 'walking'
    }
  },
  {
    name: 'Residential Route',
    data: {
      start: '37.7749,-122.4194', // San Francisco downtown
      end: '37.7649,-122.4294',   // Mission District
      mode: 'walking'
    }
  }
];

// Store route IDs for feedback testing
let routeIds = [];

/**
 * Test the risk prediction API
 */
async function testRiskAPI() {
  console.log('Testing AI Guardian Risk Prediction API\n');
  
  for (const route of testRoutes) {
    console.log(`Testing route: ${route.name}`);
    console.log(`Request data: ${JSON.stringify(route.data)}`);
    
    try {
      const response = await axios.post(`${API_URL}/risk/route`, route.data);
      console.log('Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
      // Save route ID for feedback testing
      if (response.data.routeId) {
        routeIds.push(response.data.routeId);
      }
    } catch (error) {
      console.log('Error:');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received from server. Is the server running?');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error setting up request:', error.message);
      }
    }
    
    console.log('\n-----------------------------------\n');
  }
}

/**
 * Test the feedback endpoint
 */
async function testFeedbackAPI() {
  console.log('Testing AI Guardian Feedback API\n');
  
  if (routeIds.length === 0) {
    console.log('No route IDs available for feedback testing');
    return;
  }
  
  const routeId = routeIds[0];
  const feedbackData = {
    routeId,
    userRiskScore: 7.5,
    feedback: 'This route feels more dangerous than predicted.'
  };
  
  console.log(`Submitting feedback for route ID: ${routeId}`);
  console.log(`Request data: ${JSON.stringify(feedbackData)}`);
  
  try {
    const response = await axios.post(`${API_URL}/risk/feedback`, feedbackData);
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Error:');
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received from server. Is the server running?');
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
  
  console.log('\n-----------------------------------\n');
}

/**
 * Test the model status endpoint
 */
async function testModelStatusAPI() {
  console.log('Testing AI Guardian Model Status API\n');
  
  try {
    const response = await axios.get(`${API_URL}/risk/model-status`);
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Error:');
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received from server. Is the server running?');
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
  
  console.log('\n-----------------------------------\n');
}

// Run the tests
async function runAllTests() {
  await testRiskAPI();
  await testFeedbackAPI();
  await testModelStatusAPI();
}

runAllTests();