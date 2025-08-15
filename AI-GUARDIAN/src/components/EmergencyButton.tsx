import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle, Shield, Hand } from "lucide-react";
import { useEmergency } from "@/hooks/useEmergency";

const EmergencyButton = () => {
  const [isShaking, setIsShaking] = useState(false);
  const shakeCount = useRef(0);
  const { 
    isEmergencyActive, 
    activationMethod, 
    activateEmergency, 
    deactivateEmergency 
  } = useEmergency();
  
  const isTestMode = localStorage.getItem('emergencyTestMode') === 'true';

  const handleEmergencyCall = () => {
    activateEmergency('button');
  };

  // Shake detection with sensitivity settings
  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
      const sensitivity = localStorage.getItem('shakeSensitivity') || 'medium';
      let threshold = 15; // Default medium sensitivity
      
      if (sensitivity === 'low') threshold = 20;
      if (sensitivity === 'high') threshold = 10;
      
      const handleShake = (e: DeviceMotionEvent) => {
        const acceleration = e.acceleration;
        if (acceleration) {
          const { x, y, z } = acceleration;
          
          if (Math.abs(x || 0) > threshold || 
              Math.abs(y || 0) > threshold || 
              Math.abs(z || 0) > threshold) {
            shakeCount.current++;
            
            if (shakeCount.current >= 3) {
              setActivationMode('shake');
              handleEmergencyCall();
              shakeCount.current = 0;
            }
          }
        }
      };
      
      window.addEventListener('devicemotion', handleShake);
      return () => window.removeEventListener('devicemotion', handleShake);
    }
  }, []);

  // Voice phrase detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.SpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        if (transcript.toLowerCase().includes('help me') || 
            transcript.toLowerCase().includes('emergency')) {
          setActivationMode('voice');
          handleEmergencyCall();
        }
      };
      
      recognition.start();
      return () => recognition.stop();
    }
  }, []);

  // Background service worker registration for continuous monitoring
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
          
          // Request permission for notifications
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              console.log('Notification permission granted');
            }
          });
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    }
  }, []);

  return (
    <div className="text-center space-y-4">
      <div className="relative">
        <Button
          variant="emergency"
          size="icon-lg"
          onClick={handleEmergencyCall}
          disabled={isEmergencyActive}
          className={`rounded-full h-20 w-20 ${isEmergencyActive ? 'animate-pulse-emergency' : ''} ${isShaking ? 'animate-shake' : ''}`}
        >
          {isEmergencyActive ? (
            <AlertTriangle className="h-8 w-8" />
          ) : (
            <Phone className="h-8 w-8" />
          )}
        </Button>
        
        {isTestMode && (
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-yellow-900 text-xs px-1 rounded-full">
            TEST
          </div>
        )}
        
        {/* Lock screen widget indicator */}
        <div className="absolute -top-2 -right-2 bg-destructive rounded-full p-1">
          <Shield className="h-4 w-4 text-destructive-foreground" />
        </div>
        
        {/* Voice activation indicator */}
        <div className="absolute -top-2 -left-2 bg-primary rounded-full p-1">
          <Hand className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground">
           {activationMethod === 'shake' ? 'Shake Detected!' : 
            activationMethod === 'voice' ? 'Voice Command Activated!' : 'Emergency'}
         </h3>
         <p className="text-sm text-muted-foreground">
           {activationMethod === 'shake' ? 'Emergency activated via shake' :
            activationMethod === 'voice' ? 'Emergency activated via voice' :
            'Tap or shake for instant help'}
         </p>
      </div>
    </div>
  );
};

export default EmergencyButton;