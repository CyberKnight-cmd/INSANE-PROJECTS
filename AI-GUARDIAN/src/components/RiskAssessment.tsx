import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Eye, Users, RefreshCw, MapPin } from "lucide-react";
import axios from "axios";

const RiskAssessment = () => {
  const [overallRisk, setOverallRisk] = useState(0);
  const [riskFactors, setRiskFactors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0); // Index of selected route
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRiskData = async () => {
    try {
      setIsLoading(true);
      // Call the actual Risk-prediction API
      // Use window.location.hostname to get the current host (works for both localhost and IP address)
      const host = window.location.hostname;
      const response = await axios.post(`http://${host}:3002/api/risk/route`, {
        location: 'current',
        time: new Date().toISOString()
      });
      
      setOverallRisk(parseFloat(response.data.riskScore));
      
      // Set alternative routes if available
      if (response.data.saferAlternatives && response.data.saferAlternatives.length > 0) {
        setAlternativeRoutes(response.data.saferAlternatives.map((alt: any) => ({
          name: alt.route,
          distance: 'N/A',
          duration: 'N/A',
          riskScore: parseFloat(alt.riskScore)
        })));
      }
      
      setRiskFactors([
        {
          icon: Eye,
          label: 'Lightning Score',
          score: parseFloat(response.data.lightningScore),
          description: 'Risk from lightning conditions',
          status: response.data.lightningScore >= 7 ? "good" : response.data.lightningScore >= 4 ? "moderate" : ""
        },
        {
          icon: Users,
          label: 'Traffic Density',
          score: parseFloat(response.data.trafficDensity),
          description: 'Risk from traffic conditions',
          status: response.data.trafficDensity >= 7 ? "good" : response.data.trafficDensity >= 4 ? "moderate" : ""
        },
        {
          icon: Shield,
          label: 'Crime Rate',
          score: parseFloat(response.data.crimeRate),
          description: 'Risk from crime conditions',
          status: response.data.crimeRate >= 7 ? "good" : response.data.crimeRate >= 4 ? "moderate" : ""
        }
      ]);
    } catch (error) {
      console.error("Risk prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
    
    // Set up interval to fetch risk data every 5 minutes
    intervalRef.current = setInterval(() => {
      fetchRiskData();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    return () => {
      // Clean up interval when component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 7) return "success";
    if (score >= 4) return "warning";
    return "destructive";
  };

  const getRiskLevel = (score: number) => {
    if (score >= 7) return "Low Risk";
    if (score >= 4) return "Moderate Risk";
    return "High Risk";
  };

  return (
    <Card className="shadow-card border-0 bg-gradient-to-br from-card to-accent/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Risk Assessment</span>
          </div>
          <Button 
  variant="ghost" 
  size="sm" 
  onClick={fetchRiskData}
  disabled={isLoading}
>
  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Risk Score */}
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-foreground">{overallRisk}/10</div>
          <Badge variant={getRiskColor(overallRisk) as any} className="text-sm">
            {getRiskLevel(overallRisk)}
          </Badge>
          <Progress value={overallRisk * 10} className="w-full h-2" />
        </div>

        {/* Risk Points */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Risk Points</h4>
          {riskFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <factor.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{factor.label}</p>
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </div>
              </div>
              <Badge variant={getRiskColor(factor.score) as any} className="text-xs">
                {factor.score}/10
              </Badge>
            </div>
          ))}
        </div>

        {/* Alternative Routes */}
        {alternativeRoutes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Alternative Routes</h4>
            {alternativeRoutes.map((route, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedRoute === index ? 'bg-primary/10 border-primary' : 'bg-secondary/50 border-accent/20'}`}
                onClick={() => setSelectedRoute(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Route {index + 1}</p>
                      <p className="text-xs text-muted-foreground">{route.distance} • {route.duration}</p>
                    </div>
                  </div>
                  <Badge variant={getRiskColor(route.riskScore) as any} className="text-xs">
                    {route.riskScore}/10
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* AI Recommendations */}
        <div className="bg-gradient-secondary/10 p-3 rounded-lg border border-accent/20">
          <h4 className="text-sm font-medium text-foreground mb-2">AI Recommendations</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Stay in well-lit areas</li>
            <li>• Share your location with trusted contacts</li>
            <li>• Keep emergency contacts readily available</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;