import { useContext } from 'react';
import { useEmergencyContext } from '@/providers/EmergencyProvider';

export const useEmergency = () => {
  return useEmergencyContext();
};