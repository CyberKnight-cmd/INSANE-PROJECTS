import { useEmergency } from "@/hooks/useEmergency";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const EmergencyWidget = () => {
  const { 
    isEmergencyActive, 
    activateEmergency, 
    deactivateEmergency 
  } = useEmergency();

  const handleEmergencyCall = () => {
    activateEmergency('widget');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
          variant="emergency"
          size="icon"
          onClick={handleEmergencyCall}
          disabled={isEmergencyActive}
          className={`rounded-full h-12 w-12 ${isEmergencyActive ? 'animate-pulse-emergency' : ''}`}
        >
          <AlertTriangle className="h-6 w-6" />
        </Button>
    </div>
  );
};

export default EmergencyWidget;