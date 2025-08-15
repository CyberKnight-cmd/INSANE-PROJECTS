import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Mic, MapPin, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConsentScreenProps {
  onComplete: (consents: {
    microphone: boolean;
    location: boolean;
    contacts: boolean;
  }) => void;
}

const ConsentScreen = ({ onComplete }: ConsentScreenProps) => {
  const [consents, setConsents] = useState({
    microphone: false,
    location: false,
    contacts: false
  });

  const [contactNumber, setContactNumber] = useState('');
  const [contactName, setContactName] = useState('');

  const handleConsent = (type: 'microphone' | 'location' | 'contacts') => {
    setConsents(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSubmit = async () => {
    try {
      // Save contact information to local storage
      if (consents.contacts && contactNumber) {
        localStorage.setItem('emergencyContact', contactNumber);
        localStorage.setItem('emergencyContactName', contactName);
      }
      
      // Save consent preferences
      localStorage.setItem('userConsents', JSON.stringify(consents));
      localStorage.setItem('consentGiven', 'true');
      
      // Request permissions based on consents
      if (consents.microphone) {
        console.log('Requesting microphone permissions from consent screen...');
        
        toast({
          title: "Requesting Microphone Access",
          description: "Please allow microphone access when prompted",
          duration: 5000,
        });
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false
          });
          stream.getTracks().forEach(track => track.stop());
          localStorage.setItem('microphoneConsent', 'true');
          
          toast({
            title: "Microphone Access Granted",
            description: "AI Guardian can now listen for emergency keywords",
            duration: 3000,
          });
        } catch (err) {
          console.error('Error requesting microphone permissions:', err);
          toast({
            title: "Microphone Access Denied",
            description: "Voice detection features will not work without microphone access",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
      
      if (consents.location) {
        try {
          const status = await navigator.permissions.query({ name: 'geolocation' });
          if (status.state === 'granted') {
            localStorage.setItem('locationConsent', 'true');
          } else {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            localStorage.setItem('locationConsent', 'true');
          }
        } catch (err) {
          console.error('Error requesting location permissions:', err);
        }
      }
      
      // Notify parent component
      onComplete(consents);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const allConsentsGiven = consents.microphone && consents.location && 
    (consents.contacts ? contactNumber.length > 0 : true);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to AI Guardian</CardTitle>
          <CardDescription className="text-center">
            Please provide the following permissions to ensure your safety
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="microphone" 
                checked={consents.microphone}
                onCheckedChange={() => handleConsent('microphone')}
              />
              <div className="grid gap-1.5">
                <label
                  htmlFor="microphone"
                  className="text-sm font-medium leading-none flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Microphone Access
                </label>
                <p className="text-sm text-muted-foreground">
                  Required for detecting distress keywords and activating emergency mode
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="location" 
                checked={consents.location}
                onCheckedChange={() => handleConsent('location')}
              />
              <div className="grid gap-1.5">
                <label
                  htmlFor="location"
                  className="text-sm font-medium leading-none flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Location Access
                </label>
                <p className="text-sm text-muted-foreground">
                  Required for route safety assessment and emergency response
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="contacts" 
                checked={consents.contacts}
                onCheckedChange={() => handleConsent('contacts')}
              />
              <div className="grid gap-1.5">
                <label
                  htmlFor="contacts"
                  className="text-sm font-medium leading-none flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Emergency Contact
                </label>
                <p className="text-sm text-muted-foreground">
                  Add emergency contact for SOS alerts
                </p>
              </div>
            </div>
          </div>

          {consents.contacts && (
            <div className="space-y-3 border rounded-md p-3">
              <h3 className="text-sm font-medium">Emergency Contact Details</h3>
              <div className="grid gap-2">
                <label htmlFor="contactName" className="text-xs">
                  Contact Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-2 text-sm border rounded"
                  placeholder="Enter name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="contactNumber" className="text-xs">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-2 text-sm border rounded"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleSubmit}
            disabled={!allConsentsGiven}
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConsentScreen;