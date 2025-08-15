import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEmergency } from '@/hooks/useEmergency';

export const LockScreenWidget = () => {
  const { activateEmergency, isEmergencyActive } = useEmergency();
  const [isPressed, setIsPressed] = useState(false);
  
  // Register with the lock screen API
  useEffect(() => {
    if ('lockscreen' in navigator) {
      // @ts-ignore
      navigator.lockscreen.registerWidget({
        name: 'AI Guardian Emergency',
        icon: '/icons/emergency.png',
        onClick: () => {
          activateEmergency('widget');
          // Vibrate for feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(200);
          }
        }
      });
    }
  }, [activateEmergency]);

  const handlePress = () => {
    setIsPressed(true);
    activateEmergency('widget');
    
    // Vibrate for feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
    
    setTimeout(() => setIsPressed(false), 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant={isEmergencyActive ? 'destructive' : 'emergency'}
        size="icon"
        onClick={handlePress}
        className={`rounded-full h-16 w-16 transition-all ${isPressed ? 'scale-90' : 'scale-100'}`}
      >
        <AlertTriangle className="h-8 w-8" />
      </Button>
    </div>
  );
};