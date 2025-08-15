import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Share2, Mic, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useEmergency } from "@/hooks/useEmergency";
import { useState } from "react";

const QuickActions = () => {
  const { toast } = useToast();
  const { startBackgroundListening, stopBackgroundListening, isListening } = useEmergency();
  const [isSharing, setIsSharing] = useState(false);

  const handleAction = (action: string) => {
    switch(action) {
      case "Quick Alert":
        // Send a quick alert to emergency contacts
        toast({
          title: "Quick Alert Sent",
          description: "Your location has been shared with your emergency contacts.",
          variant: "default",
        });
        sonnerToast.success("Quick Alert Sent", {
          description: "Your location has been shared with your emergency contacts.",
        });
        break;
        
      case "Location Sharing":
        // Toggle location sharing
        setIsSharing(!isSharing);
        toast({
          title: isSharing ? "Location Sharing Stopped" : "Location Sharing Started",
          description: isSharing ? "Your real-time location is no longer being shared." : "Your real-time location is now being shared.",
          variant: "default",
        });
        break;
        
      case "Voice Command":
        // Toggle voice command listening
        if (isListening) {
          stopBackgroundListening();
          toast({
            title: "Voice Command Deactivated",
            description: "Voice command detection has been turned off.",
          });
        } else {
          startBackgroundListening();
          toast({
            title: "Voice Command Activated",
            description: "Say 'Help' or 'Emergency' to trigger an alert.",
          });
          sonnerToast.info("Voice Command Activated", {
            description: "Say 'Help' or 'Emergency' to trigger an alert.",
          });
        }
        break;
        
      case "Emergency Alert":
        // Show emergency alert instructions
        toast({
          title: "Emergency Alert",
          description: "Use the emergency button for immediate assistance.",
          variant: "destructive",
        });
        sonnerToast.error("Emergency Alert", {
          description: "Use the emergency button for immediate assistance.",
        });
        break;
        
      default:
        toast({
          title: `${action} Activated`,
          description: `${action} feature has been triggered.`,
        });
    }
  };

  const actions = [
    {
      icon: MessageCircle,
      label: "Quick Alert",
      description: "Send location to contacts",
      variant: "accent" as const,
      action: "Quick Alert"
    },
    {
      icon: Share2,
      label: "Share Location",
      description: "Share real-time location",
      variant: "hero" as const,
      action: "Location Sharing",
      active: isSharing
    },
    {
      icon: Mic,
      label: "Voice Command",
      description: "Detect emergency keywords",
      variant: "default" as const,
      action: "Voice Command",
      active: isListening
    },
    {
      icon: AlertCircle,
      label: "Emergency Alert",
      description: "Get immediate assistance",
      variant: "destructive" as const,
      action: "Emergency Alert"
    }
  ];

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
              onClick={() => handleAction(action.action)}
            >
              <action.icon className="h-6 w-6" />
              <div>
                <div className="text-sm font-medium">{action.label}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;