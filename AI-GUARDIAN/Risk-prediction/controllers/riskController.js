const axios = require('axios');
const { generateSaferAlternatives, generateExplanation } = require('../utils/riskUtils');
const riskModel = require('../utils/advancedRiskModel');
const dataCollector = require('../utils/dataCollector');

/**
 * Predict risk for a given route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.predictRouteRisk = async (req, res) => {
  try {
    const { start, end, mode } = req.body;
    
    // Validate input
    if (!start || !end || !mode) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide start, end coordinates and travel mode' 
      });
    }
    
    // Parse coordinates
    const startCoords = parseCoordinates(start);
    const endCoords = parseCoordinates(end);
    
    if (!startCoords || !endCoords) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid coordinates format. Use format "latitude,longitude"' 
      });
    }
    
    // Get route data
    const routeData = await getRouteData(startCoords, endCoords, mode);
    
    // Initialize risk model if not already initialized
    await riskModel.init();
    
    // Calculate risk score using advanced model
    const riskScore = await riskModel.calculateRiskScore(routeData);
    
    // Generate safer alternatives
    const saferAlternatives = generateSaferAlternatives(routeData, riskScore);
    
    // Add this data to training dataset and get route ID
    const routeId = await dataCollector.addTrainingSample(routeData, riskScore);
    
    // Generate explanation
    const explanation = generateExplanation(routeData, riskScore);
    
    // Return risk assessment
    return res.status(200).json({
      routeId,
      riskScore,
      saferAlternatives,
      explanation
    });
    
  } catch (error) {
    console.error('Error predicting route risk:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while predicting route risk' 
    });
  }
};

/**
 * Parse coordinates string into an object
 * @param {String} coordsString - Coordinates in format "latitude,longitude"
 * @returns {Object|null} - Coordinates object or null if invalid
 */
const parseCoordinates = (coordsString) => {
  try {
    const [latitude, longitude] = coordsString.split(',').map(coord => parseFloat(coord.trim()));
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return null;
    }
    
    return { latitude, longitude };
  } catch (error) {
    return null;
  }
};

/**
 * Get route data from external services
 * @param {Object} start - Start coordinates
 * @param {Object} end - End coordinates
 * @param {String} mode - Travel mode
 * @returns {Object} - Route data
 */
const getRouteData = async (start, end, mode) => {
  try {
    // Generate path between points
    const path = generateSimulatedPath(start, end);
    
    // Calculate estimated distance and duration
    const distance = calculateDistance(start, end);
    const duration = estimateDuration(distance, mode);
    
    // In production, we would use real mapping APIs like Google Maps or Mapbox
    // to get accurate route information
    
    // Use data collector to gather real-world data
    console.log('Collecting real-world data for route...');
    const routeData = await dataCollector.collectRouteData(path);
    
    // Add distance and duration to route data
    routeData.distance = distance;
    routeData.duration = duration;
    routeData.mode = mode;
    
    return routeData;
  } catch (error) {
    console.error('Error getting route data:', error);
    
    // Fallback to simulated data if data collection fails
    return {
      distance: Math.random() * 5, // km
      duration: Math.random() * 60, // minutes
      path: generateSimulatedPath(start, end),
      crimeHotspots: Math.floor(Math.random() * 3),
      poorLightingAreas: Math.floor(Math.random() * 4),
      trafficDensity: Math.random() * 10,
      weatherCondition: ['clear', 'rain', 'fog'][Math.floor(Math.random() * 3)],
      timeOfDay: new Date().getHours(),
      mode: mode
    };
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} start - Start coordinates
 * @param {Object} end - End coordinates
 * @returns {Number} - Distance in kilometers
 */
const calculateDistance = (start, end) => {
  const R = 6371; // Earth's radius in km
  const dLat = (end.latitude - start.latitude) * Math.PI / 180;
  const dLon = (end.longitude - start.longitude) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(start.latitude * Math.PI / 180) * Math.cos(end.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
};

/**
 * Estimate duration based on distance and travel mode
 * @param {Number} distance - Distance in kilometers
 * @param {String} mode - Travel mode
 * @returns {Number} - Duration in minutes
 */
const estimateDuration = (distance, mode) => {
  // Average speeds in km/h
  const speeds = {
    walking: 5,
    cycling: 15,
    driving: 40,
    transit: 25
  };
  
  const speed = speeds[mode] || speeds.walking;
  const duration = (distance / speed) * 60; // Convert hours to minutes
  
  return duration;
};

/**
 * Generate a simulated path between two points
 * @param {Object} start - Start coordinates
 * @param {Object} end - End coordinates
 * @returns {Array} - Array of coordinate points
 */
const generateSimulatedPath = (start, end) => {
  const path = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = start.latitude + (end.latitude - start.latitude) * ratio;
    const lng = start.longitude + (end.longitude - start.longitude) * ratio;
    
    // Add some randomness to make it look like a real path
    const jitter = 0.001 * (Math.random() - 0.5);
    
    path.push({
      latitude: lat + jitter,
      longitude: lng + jitter
    });
  }
  
  return path;
};

/**
 * Handle user feedback for risk scores
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitRiskFeedback = async (req, res) => {
  try {
    const { routeId, userRiskScore, feedback } = req.body;
    
    // Validate input
    if (routeId === undefined || userRiskScore === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide routeId and userRiskScore' 
      });
    }
    
    // Validate risk score is between 0 and 10
    if (userRiskScore < 0 || userRiskScore > 10) {
      return res.status(400).json({ 
        success: false, 
        error: 'User risk score must be between 0 and 10' 
      });
    }
    
    // Record user feedback
    await dataCollector.recordUserFeedback(routeId, userRiskScore, feedback);
    
    // If the model is initialized, update weights based on feedback
    if (riskModel.initialized) {
      // Get the route data from the collector
      const routeData = await dataCollector.getRouteDataById(routeId);
      if (routeData) {
        // Get the predicted score
        const predictedScore = await riskModel.calculateRiskScore(routeData);
        // Update weights based on user feedback
        await riskModel.updateWeights(routeData, predictedScore, userRiskScore);
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Feedback recorded successfully'
    });
    
  } catch (error) {
    console.error('Error recording risk feedback:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while recording feedback' 
    });
  }
};

/**
 * Get model training status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModelStatus = async (req, res) => {
  try {
    const status = {
      isInitialized: riskModel.initialized,
      trainingDataCount: await dataCollector.getTrainingDataCount(),
      userFeedbackCount: await dataCollector.getUserFeedbackCount(),
      modelAccuracy: riskModel.initialized ? riskModel.modelAccuracy : null
    };
    
    return res.status(200).json(status);
  } catch (error) {
    console.error('Error getting model status:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while getting model status' 
    });
  }
};