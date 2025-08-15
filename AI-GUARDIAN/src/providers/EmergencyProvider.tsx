import React, { createContext, ReactNode, useState, useEffect, useRef } from 'react';
import { LockScreenWidget } from '@/components/LockScreenWidget';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

export type EmergencyContextType = {
  isEmergencyActive: boolean;
  activationMethod: 'button' | 'voice' | 'shake' | 'widget';
  activateEmergency: (method?: 'button' | 'voice' | 'shake' | 'widget') => void;
  deactivateEmergency: () => void;
  emergencyContact: string;
  setEmergencyContact: (contact: string) => void;
  isListening: boolean;
  startBackgroundListening: () => void;
  stopBackgroundListening: () => void;
  isSendingMessage: boolean;
};

export const EmergencyContext = createContext<EmergencyContextType | null>(null);

export const EmergencyProvider = ({ children }: { children: ReactNode }) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activationMethod, setActivationMethod] = useState<'button' | 'voice' | 'shake' | 'widget'>('button');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [shakeThreshold] = useState(15); // Adjust sensitivity as needed
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
  // Load emergency contact from local storage on mount
  useEffect(() => {
    const savedContact = localStorage.getItem('emergencyContact');
    if (savedContact) {
      setEmergencyContact(savedContact);
    }
    
    // Check if user has given consent for background listening
    const userConsents = JSON.parse(localStorage.getItem('userConsents') || '{}');
    if (userConsents.microphone) {
      startBackgroundListening();
    }
    
    // Setup shake detection if device supports it
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleShake);
    }
    
    return () => {
      stopBackgroundListening();
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleShake);
      }
    };
  }, []);

  const startBackgroundListening = () => {
    if (isListening) return;
    
    try {
      // Connect to the AI Guardian API
      // Use window.location.hostname to get the current host (works for both localhost and IP address)
      const host = window.location.hostname;
      socketRef.current = io(`http://${host}:3002`);
      
      // Explicitly request microphone permissions with a user gesture
      console.log('Requesting microphone permissions...');
      console.log('Platform:', navigator.userAgent); // Log platform for debugging
      
      // Define constraints with explicit video:false for Android compatibility
      const constraints = {
        audio: true,
        video: false // Explicitly disable video to avoid confusion on Android
      };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          console.log('Microphone access granted for background listening');
          streamRef.current = stream;
          setIsListening(true);
          
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          
          // Start recording in chunks
          mediaRecorder.start(1000); // Send audio chunks every 1 second
          
          mediaRecorder.ondataavailable = (e) => {
            if (socketRef.current && socketRef.current.connected) {
              socketRef.current.emit('audio-stream', e.data);
            }
          };
          
          // Listen for keyword detection events
          socketRef.current.on('detection', (data) => {
            if (data.detected) {
              // Activate emergency mode
              setIsEmergencyActive(true);
              setActivationMethod('voice');
              
              // Send SMS to emergency contact if available
              if (emergencyContact) {
                sendSOSMessage('voice');
              }
              
              toast({
                title: "Emergency Activated!",
                description: `Keyword detected. Help is on the way`,
                variant: "destructive",
              });
            }
          });
          
          // Notify user that background listening is active
          toast({
            title: "Background Listening Active",
            description: "AI Guardian is now monitoring for distress keywords",
          });
        })
        .catch(err => {
          console.error("Microphone access error:", err);
          console.error("Error name:", err.name);
          console.error("Error message:", err.message);
          setIsListening(false); // Reset state to allow retry
          
          toast({
            title: "Microphone Access Required",
            description: "Please enable microphone permissions in your device settings",
            variant: "destructive",
          });
        });
    } catch (error) {
      console.error("Error starting background listening:", error);
      setIsListening(false); // Ensure state is reset on error
    }
  };

  const stopBackgroundListening = () => {
    if (!isListening) return;
    
    // Stop the media recorder if it exists
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    setIsListening(false);
  };

  const handleShake = (event: DeviceMotionEvent) => {
    const acceleration = event.acceleration;
    if (!acceleration) return;
    
    const totalAcceleration = Math.sqrt(
      Math.pow(acceleration.x || 0, 2) +
      Math.pow(acceleration.y || 0, 2) +
      Math.pow(acceleration.z || 0, 2)
    );
    
    if (totalAcceleration > shakeThreshold) {
      activateEmergency('shake');
    }
  };

  // Function to send SOS message to emergency contact
  const sendSOSMessage = async (method: 'button' | 'voice' | 'shake' | 'widget') => {
    if (!emergencyContact || isSendingMessage) return;
    
    try {
      setIsSendingMessage(true);
      
      // Get contact name from localStorage
      const contactName = localStorage.getItem('emergencyContactName') || 'Emergency Contact';
      
      // Get current location (in a real app, you would use geolocation)
      const location = 'Current Location';
      
      // Create message based on activation method
      let message = 'I need help! Please check on me.';
      if (method === 'voice') {
        message = 'I triggered a voice distress signal. Please help!';
      } else if (method === 'shake') {
        message = 'My phone detected a shake emergency pattern. Please help!';
      }
      
      // Call the SOS API with error handling
      try {
        // Use window.location.hostname to get the current host (works for both localhost and IP address)
        const host = window.location.hostname;
        const response = await axios.post(`http://${host}:3002/send-sos`, {
          contactNumber: emergencyContact,
          contactName,
          location,
          message
        }, {
          timeout: 5000 // 5 second timeout
        });
        
        if (response.data.success) {
          // Show toast notification
          toast({
            title: "Emergency Alert Sent",
            description: `SOS message sent to ${contactName}`,
            variant: "destructive",
          });
          
          // Also show a more prominent notification
          sonnerToast.error("Emergency Alert Sent", {
            description: `SOS message sent to ${contactName}`,
            position: "top-center",
            duration: 10000,
          });
          return true;
        } else {
          throw new Error(response.data.message || 'Failed to send SOS message');
        }
      } catch (error) {
        console.error('SMS API Error:', error);
        
        // Fallback to Twilio directly if API fails
        if (process.env.REACT_APP_TWILIO_ACCOUNT_SID) {
          try {
            const twilioClient = require('twilio')(
              process.env.REACT_APP_TWILIO_ACCOUNT_SID,
              process.env.REACT_APP_TWILIO_AUTH_TOKEN
            );
            
            await twilioClient.messages.create({
              body: message,
              from: process.env.REACT_APP_TWILIO_PHONE_NUMBER,
              to: emergencyContact
            });
            
            toast({
              title: "Emergency Alert Sent (Fallback)",
              description: `Direct SMS sent to ${contactName}`,
              variant: "destructive",
            });
            return true;
          } catch (twilioError) {
            console.error('Twilio Fallback Error:', twilioError);
            throw new Error('Both API and fallback SMS failed');
          }
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Error sending SOS message:', error);
      toast({
        title: "Failed to Send Alert",
        description: "Could not send emergency message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const activateEmergency = (method: 'button' | 'voice' | 'shake' | 'widget' = 'button') => {
    setIsEmergencyActive(true);
    setActivationMethod(method);
    
    // Get emergency contact from localStorage
    const contactData = localStorage.getItem('emergencyContact');
    const contact = contactData ? JSON.parse(contactData) : null;
    
    // Show toast notification
    toast({
      title: 'Emergency Activated',
      description: `Emergency mode activated via ${method}. ${contact ? `Alerting ${contact.name}.` : 'No emergency contact set.'}`,
      variant: "destructive"
    });
    
    // Send emergency alert to contact
    if (emergencyContact) {
      sendSOSMessage(method);
    }
    
    sonnerToast.error('Emergency Alert Sent', {
      description: 'Help is on the way',
      position: 'top-center',
    });
  };

  const deactivateEmergency = () => {
  setIsEmergencyActive(false);
  window.removeEventListener('devicemotion', handleShake);
  
  toast({
    title: "Emergency Deactivated",
    description: "Emergency mode has been turned off",
  });
  
  sonnerToast.success("Emergency Deactivated", {
    description: "Emergency mode has been turned off",
    position: "top-center",
  });
};

  const emergencyValue = {
    isEmergencyActive,
    activationMethod,
    activateEmergency,
    deactivateEmergency,
    emergencyContact,
    setEmergencyContact,
    isListening,
    startBackgroundListening,
    stopBackgroundListening,
    isSendingMessage
  };
  
  return (
    <EmergencyContext.Provider value={emergencyValue}>
      {children}
      <LockScreenWidget />
    </EmergencyContext.Provider>
  );
};

export const useEmergencyContext = () => {
  const context = React.useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergencyContext must be used within an EmergencyProvider');
  }
  return context;
}