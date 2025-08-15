import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmergencyProvider } from "@/providers/EmergencyProvider";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ConsentScreen from "./components/ConsentScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already given consent
    // Force consent screen to show on first load regardless of platform
    const consentGiven = localStorage.getItem('consentGiven') === 'true';
    
    // Clear any potentially corrupted consent data on mobile devices
    // This ensures the consent screen will appear on Android
    if (!consentGiven) {
      // Remove any partial consent data that might be preventing the screen from showing
      localStorage.removeItem('userConsents');
      localStorage.removeItem('microphoneConsent');
    }
    
    // Show consent screen if consent not given
    setShowConsent(!consentGiven);
    
    // Log for debugging
    console.log('Consent check - consentGiven:', consentGiven);
  }, []);
  
  const handleConsentComplete = (consents) => {
    setShowConsent(false);
  };
  
  return (
  <EmergencyProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showConsent && <ConsentScreen onComplete={handleConsentComplete} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </EmergencyProvider>
  );
};

export default App;
