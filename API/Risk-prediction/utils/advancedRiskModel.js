const fs = require('fs');
const path = require('path');
const { trainingData, saveTrainingData } = require('./dataCollector');

const WEIGHTS_FILE = path.join(__dirname, '..', 'data', 'model_weights.json');

let modelWeights = {
  crimeRate: 0.4,
  lightingLevel: 0.2,
  weatherCondition: 0.1,
  trafficDensity: 0.2,
  emergencyResponseTime: 0.1,
  routeComplexity: 0.05,
  modelAccuracy: 0.85
};

function loadModelWeights() {
  try {
    if (fs.existsSync(WEIGHTS_FILE)) {
      const data = fs.readFileSync(WEIGHTS_FILE, 'utf8');
      modelWeights = JSON.parse(data);
      console.log('Model weights loaded successfully.');
    }
  } catch (error) {
    console.error('Error loading model weights:', error);
  }
}

function saveModelWeights() {
  try {
    fs.writeFileSync(WEIGHTS_FILE, JSON.stringify(modelWeights, null, 2));
    console.log('Model weights saved successfully.');
  } catch (error) {
    console.error('Error saving model weights:', error);
  }
}

function calculateRisk(data) {
    let score = 0;
    const weights = modelWeights;

    // Normalize and score each factor (example logic)
    score += (data.crime.crimeRate / 10) * 10 * weights.crimeRate; // Scale to 0-10
    score += (1 - data.lighting.lightingLevel) * 10 * weights.lightingLevel; // Invert and scale
    score += (data.traffic.density) * 10 * weights.trafficDensity;
    score += (data.emergency.responseTime / 30) * 10 * weights.emergencyResponseTime; // Normalize to 0-1

    return Math.min(10, Math.max(0, score)); // Clamp score between 0 and 10
}

function generateExplanation(data, riskScore) {
    const factors = [];
    if (data.crime.crimeRate > 5) factors.push('high crime rate');
    if (data.lighting.lightingLevel < 0.4) factors.push('poor lighting');
    if (data.traffic.density > 0.6) factors.push('heavy traffic');
    if (data.emergency.responseTime > 15) factors.push('slow emergency response');

    if (factors.length === 0) return 'This route is considered safe with no significant risk factors.';

    return `Risk score is ${riskScore.toFixed(2)} due to factors like ${factors.join(', ')}.`;
}

function trainModelWithFeedback(feedback) {
    const { routeId, isSafe } = feedback;
    const trainingSample = trainingData.find(d => d.id === routeId);

    if (!trainingSample) return;

    const predictedRisk = calculateRisk(trainingSample.data[0]);
    const actualRisk = isSafe ? 0 : 1; // Simplified: 0 for safe, 1 for risky

    // Basic learning: adjust weights based on error
    const error = actualRisk - (predictedRisk / 10);
    const learningRate = 0.01;

    for (const key in modelWeights) {
        if (key !== 'modelAccuracy') {
            // Example adjustment logic
            const featureValue = (trainingSample.data[0].crime.crimeRate / 10) || 0.5; // Simplified
            modelWeights[key] += learningRate * error * featureValue;
            modelWeights[key] = Math.max(0, Math.min(1, modelWeights[key])); // Clamp weights
        }
    }

    // Recalculate model accuracy (simplified)
    modelWeights.modelAccuracy -= Math.abs(error) * 0.01;
    modelWeights.modelAccuracy = Math.max(0.5, Math.min(0.99, modelWeights.modelAccuracy));

    saveModelWeights();
    saveTrainingData();
}

function getModelStatus() {
    return {
        isInitialized: true, // Assuming model is always initialized
        trainingDataCount: trainingData.length,
        userFeedbackCount: trainingData.filter(d => d.feedback).length,
        modelAccuracy: modelWeights.modelAccuracy
    };
}

// Initial load
loadModelWeights();

module.exports = {
    calculateRisk,
    generateExplanation,
    trainModelWithFeedback,
    getModelStatus,
    loadModelWeights,
    saveModelWeights
};