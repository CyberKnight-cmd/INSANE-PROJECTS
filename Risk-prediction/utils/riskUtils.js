/**
 * Calculate risk score based on route data
 * @param {Object} routeData - Data about the route
 * @returns {Number} - Risk score from 0 (safest) to 10 (most dangerous)
 */
exports.calculateRiskScore = (routeData) => {
  // In a real implementation, this would use a sophisticated algorithm
  // that considers multiple factors with different weights
  
  let score = 0;
  
  // Crime factor (0-4 points)
  score += routeData.crimeHotspots * 1.5;
  
  // Lighting factor (0-3 points)
  score += routeData.poorLightingAreas * 0.75;
  
  // Time of day factor (0-2 points)
  const hour = routeData.timeOfDay;
  if (hour < 6 || hour > 21) {
    // Night time (10pm - 6am)
    score += 2;
  } else if (hour < 8 || hour > 18) {
    // Dawn/dusk (6am-8am, 7pm-10pm)
    score += 1;
  }
  
  // Weather factor (0-1 points)
  if (routeData.weatherCondition === 'fog') {
    score += 1;
  } else if (routeData.weatherCondition === 'rain') {
    score += 0.5;
  }
  
  // Traffic density factor (0-1 points)
  // Higher traffic can mean more witnesses (safer), but also more confusion
  if (routeData.trafficDensity < 3) {
    score += 1; // Very low traffic is riskier
  } else if (routeData.trafficDensity < 5) {
    score += 0.5; // Moderate traffic
  }
  
  // Cap the score between 0 and 10
  return Math.min(Math.max(score, 0), 10);
};

/**
 * Generate safer alternative routes
 * @param {Object} routeData - Data about the original route
 * @param {Number} originalRiskScore - Risk score of the original route
 * @returns {Array} - Array of alternative routes with lower risk scores
 */
exports.generateSaferAlternatives = (routeData, originalRiskScore) => {
  // In a real implementation, this would call routing APIs to get
  // alternative routes and then calculate their risk scores
  
  // For this demo, we'll generate simulated alternatives
  const alternatives = [];
  
  // Generate 1-3 alternatives
  const numAlternatives = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numAlternatives; i++) {
    // Create a variation of the original route data
    const alternativeData = { ...routeData };
    
    // Reduce crime hotspots and poor lighting areas
    alternativeData.crimeHotspots = Math.max(0, routeData.crimeHotspots - 1);
    alternativeData.poorLightingAreas = Math.max(0, routeData.poorLightingAreas - 1);
    
    // Slightly increase distance and duration (safer routes might be longer)
    alternativeData.distance = routeData.distance * (1 + Math.random() * 0.3);
    alternativeData.duration = routeData.duration * (1 + Math.random() * 0.3);
    
    // Calculate new risk score
    const newRiskScore = exports.calculateRiskScore(alternativeData);
    
    // Only include if it's actually safer
    if (newRiskScore < originalRiskScore) {
      alternatives.push({
        riskScore: parseFloat(newRiskScore.toFixed(1)),
        distanceIncrease: `+${Math.round((alternativeData.distance - routeData.distance) / routeData.distance * 100)}%`,
        timeIncrease: `+${Math.round((alternativeData.duration - routeData.duration) / routeData.duration * 100)}%`,
        description: generateAlternativeDescription(routeData, alternativeData)
      });
    }
  }
  
  return alternatives;
};

/**
 * Generate explanation for risk score
 * @param {Object} routeData - Data about the route
 * @param {Number} riskScore - Calculated risk score
 * @returns {String} - Human-readable explanation
 */
exports.generateExplanation = (routeData, riskScore) => {
  const factors = [];
  
  // Add crime factor if relevant
  if (routeData.crimeHotspots > 0) {
    factors.push(`${routeData.crimeHotspots} high-crime area${routeData.crimeHotspots > 1 ? 's' : ''}`);
  }
  
  // Add lighting factor if relevant
  if (routeData.poorLightingAreas > 0) {
    factors.push(`${routeData.poorLightingAreas} area${routeData.poorLightingAreas > 1 ? 's' : ''} with poor lighting`);
  }
  
  // Add time factor if relevant
  const hour = routeData.timeOfDay;
  if (hour < 6 || hour > 21) {
    factors.push('night time travel');
  }
  
  // Add weather factor if relevant
  if (routeData.weatherCondition !== 'clear') {
    factors.push(`${routeData.weatherCondition} weather conditions`);
  }
  
  // Add traffic factor if relevant
  if (routeData.trafficDensity < 3) {
    factors.push('low pedestrian traffic');
  }
  
  // Create explanation based on risk level
  if (riskScore < 3) {
    return `This route is generally safe with minimal risk factors.`;
  } else if (riskScore < 5) {
    return `This route has some minor risk factors: ${joinWithCommasAndAnd(factors)}.`;
  } else if (riskScore < 7) {
    return `This route has moderate risk factors: ${joinWithCommasAndAnd(factors)}.`;
  } else {
    return `Route passes through ${joinWithCommasAndAnd(factors)}.`;
  }
};

/**
 * Generate description for an alternative route
 * @param {Object} originalRoute - Data about the original route
 * @param {Object} alternativeRoute - Data about the alternative route
 * @returns {String} - Description of the alternative route
 */
const generateAlternativeDescription = (originalRoute, alternativeRoute) => {
  const improvements = [];
  
  // Compare crime hotspots
  const crimeDiff = originalRoute.crimeHotspots - alternativeRoute.crimeHotspots;
  if (crimeDiff > 0) {
    improvements.push(`avoids ${crimeDiff} high-crime area${crimeDiff > 1 ? 's' : ''}`);
  }
  
  // Compare lighting
  const lightingDiff = originalRoute.poorLightingAreas - alternativeRoute.poorLightingAreas;
  if (lightingDiff > 0) {
    improvements.push(`has better lighting in ${lightingDiff} area${lightingDiff > 1 ? 's' : ''}`);
  }
  
  // If no specific improvements, use a generic description
  if (improvements.length === 0) {
    return 'Takes a slightly different path with lower overall risk';
  }
  
  return `This route ${joinWithCommasAndAnd(improvements)}`;
};

/**
 * Join array elements with commas and 'and'
 * @param {Array} arr - Array of strings to join
 * @returns {String} - Joined string
 */
const joinWithCommasAndAnd = (arr) => {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  
  const lastItem = arr.pop();
  return `${arr.join(', ')}, and ${lastItem}`;
};