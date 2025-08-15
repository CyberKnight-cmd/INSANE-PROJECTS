import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EmergencyButton from "@/components/EmergencyButton";
import RouteInfo from "@/components/RouteInfo";
import RiskAssessment from "@/components/RiskAssessment";
import QuickActions from "@/components/QuickActions";
import { CrimeSummarizer } from "@/components/CrimeSummarizer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, MapPin, Car } from "lucide-react";
import { useEmergency } from "@/hooks/useEmergency";

const Index = () => {
  const [tookRide, setTookRide] = useState(false);
  const { startBackgroundListening } = useEmergency();
  
  useEffect(() => {
    // Check both new and legacy consent formats
    const userConsents = JSON.parse(localStorage.getItem('userConsents') || '{}');
    const legacyConsent = localStorage.getItem('microphoneConsent') === 'true';
    const microphoneConsent = userConsents.microphone === true || legacyConsent;
    
    console.log('Microphone consent check on Index page:', { 
      newConsent: userConsents.microphone, 
      legacyConsent,
      finalConsent: microphoneConsent
    });
    
    if (microphoneConsent) {
      // Add a small delay to ensure permissions are properly handled on Android
      setTimeout(() => {
        console.log('Starting background listening with delay...');
        startBackgroundListening();
      }, 1500);
    } else {
      console.log('No microphone consent found');
    }
    
    // Check if there was an active ride session
    const activeRide = localStorage.getItem('activeRide') === 'true';
    if (activeRide) {
      setTookRide(true);
    }
  }, [startBackgroundListening]);
  
  const handleTookRide = () => {
    setTookRide(true);
    localStorage.setItem('activeRide', 'true');
    // Here we would start the periodic risk assessment API calls
  };
  
  const handleEndRide = () => {
    setTookRide(false);
    localStorage.setItem('activeRide', 'false');
    // Here we would stop the periodic risk assessment API calls
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Section with Emergency Button */}
        <section className="text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Your Personal Safety Guardian
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI-powered protection designed specifically for women's safety. Get instant help, route guidance, and real-time risk assessment.
            </p>
          </div>
          
          {/* Emergency Button */}
          <div className="flex justify-center py-4">
            <EmergencyButton />
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Shield className="h-3 w-3 text-success" />
              <span>Protected</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-primary" />
              <span>2 Contacts Online</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-accent" />
              <span>Location Shared</span>
            </Badge>
          </div>
          
          {/* Took a ride button */}
          {!tookRide ? (
            <div className="mt-4">
              <Button 
                onClick={handleTookRide}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                size="lg"
              >
                <Car className="h-4 w-4" />
                Took a ride?
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <Button 
                onClick={handleEndRide}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                size="sm"
              >
                End Ride
              </Button>
            </div>
          )}
        </section>

        {/* Main Dashboard */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Route Info */}
          <div className="lg:col-span-1 space-y-6">
            <RouteInfo />
            
            {/* Quick Stats */}
            <Card className="shadow-card border-0">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Protection</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">5sec</div>
                    <div className="text-xs text-muted-foreground">Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Risk Assessment (conditionally rendered) */}
          <div className="lg:col-span-1">
            {tookRide ? (
              <RiskAssessment />
            ) : (
              <Card className="shadow-card border-0 bg-gradient-to-br from-card to-accent/10 h-full flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-medium">Ready for your journey?</h3>
                  <p className="text-muted-foreground">Click "Took a ride?" above to see risk assessment and safety recommendations for your route.</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
            <CrimeSummarizer />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm">Safe route completed to Downtown Office</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Location shared with emergency contact</span>
                  </div>
                  <span className="text-xs text-muted-foreground">15 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm">Risk assessment updated for current area</span>
                  </div>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;