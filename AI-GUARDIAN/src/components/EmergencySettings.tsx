import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Phone, Bell, Volume2 } from 'lucide-react';
import { useEmergency } from '@/hooks/useEmergency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const EmergencySettings = () => {
  const { 
    activationMethod, 
    emergencyContact, 
    setEmergencyContact,
    isListening,
    startBackgroundListening,
    stopBackgroundListening
  } = useEmergency();
  const [testMode, setTestMode] = useState(false);
  const [backgroundListening, setBackgroundListening] = useState(false);
  const [contactName, setContactName] = useState('');

  useEffect(() => {
    setTestMode(localStorage.getItem('emergencyTestMode') === 'true');
    setBackgroundListening(isListening);
    
    // Load contact name from local storage
    const savedName = localStorage.getItem('emergencyContactName');
    if (savedName) {
      setContactName(savedName);
    }
  }, [isListening]);

  const setSensitivity = (level: 'low' | 'medium' | 'high') => {
    localStorage.setItem('shakeSensitivity', level);
  };

  const handleTestModeChange = (checked: boolean) => {
    localStorage.setItem('emergencyTestMode', checked.toString());
    setTestMode(checked);
  };
  
  const handleBackgroundListeningChange = (checked: boolean) => {
    setBackgroundListening(checked);
    if (checked) {
      startBackgroundListening();
    } else {
      stopBackgroundListening();
    }
  };
  
  const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setContactName(name);
    localStorage.setItem('emergencyContactName', name);
  };
  
  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setEmergencyContact(number);
    localStorage.setItem('emergencyContact', number);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
          <CardDescription>
            This contact will receive SOS alerts when you're in danger
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <input
              id="contactName"
              type="text"
              value={contactName}
              onChange={handleContactNameChange}
              placeholder="Enter name"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="emergencyContact">Contact Number</Label>
            <input
              id="emergencyContact"
              type="tel"
              value={emergencyContact}
              onChange={handleContactNumberChange}
              placeholder="Enter phone number"
              className="w-full p-2 border rounded"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Monitoring
          </CardTitle>
          <CardDescription>
            Configure how the app listens for distress keywords
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="backgroundListening">Background Listening</Label>
              <p className="text-sm text-muted-foreground">Listen for distress keywords in the background</p>
            </div>
            <Switch
              id="backgroundListening"
              checked={backgroundListening}
              onCheckedChange={handleBackgroundListeningChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="testMode">Test Mode</Label>
              <p className="text-sm text-muted-foreground">Simulate emergency without sending real alerts</p>
            </div>
            <Switch
              id="testMode"
              checked={testMode}
              onCheckedChange={handleTestModeChange}
            />
          </div>
          
          <div className="space-y-2">
          <p className="text-sm">Shake Sensitivity:</p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSensitivity('low')}
              className="text-xs"
            >
              Low
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSensitivity('medium')}
              className="text-xs"
            >
              Medium
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSensitivity('high')}
              className="text-xs"
            >
              High
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="testMode" className="text-xs">Test Mode:</label>
          <input 
            type="checkbox" 
            id="testMode"
            checked={testMode}
            onChange={(e) => handleTestModeChange(e.target.checked)}
            className="h-4 w-4"
          />
        </div>
        
        <p className="text-xs text-muted-foreground">
          Current activation: {activationMethod || 'none'}
        </p>
        </CardContent>
      </Card>
    </div>
  );
};