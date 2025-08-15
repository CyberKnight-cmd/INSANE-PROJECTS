import axios from 'axios';


const API_BASE_URL = 'http://localhost:3002/api';

export interface CrimeSummary {
  id: string;
  summary: string;
  date: string;
  timeOfDay: string;
}

export const fetchCrimeSummaries = async (offset = 0): Promise<{
  crimes: CrimeSummary[];
  nextOffset: number | null;
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crimes`, {
      params: { offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crime summaries:', error);
    throw error;
  }
};