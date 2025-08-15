import axios from 'axios';

interface RiskAssessmentResponse {
  riskLevel: number;
  recommendation: string;
  alternateRoutes?: {
    name: string;
    safetyScore: number;
    distance: string;
    duration: string;
  }[];
  environmentalConditions?: {
    weather: string;
    traffic: string;
    crimeRate: string;
  };
}

export const fetchRiskAssessment = async (destination: string): Promise<RiskAssessmentResponse> => {
  try {
    // Use mock data instead of calling a non-existent API
    const mockResponse = {
      riskLevel: Math.floor(Math.random() * 10) + 1,
      recommendation: 'Take well-lit routes and stay in populated areas.',
      alternateRoutes: [
        {
          name: 'Safer Route',
          safetyScore: 8,
          distance: '2.5 km',
          duration: '20 min'
        },
        {
          name: 'Fastest Route',
          safetyScore: 6,
          distance: '1.8 km',
          duration: '15 min'
        }
      ],
      environmentalConditions: {
        weather: 'Clear',
        traffic: 'Moderate',
        crimeRate: 'Low'
      }
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Error fetching risk assessment:', error);
    return {
      riskLevel: 5,
      recommendation: 'Unable to assess risk at this time. Proceed with caution.'
    };
  }
};