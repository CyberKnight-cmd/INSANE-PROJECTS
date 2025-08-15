import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Define the CrimeSummary type locally instead of importing it
interface CrimeSummary {
  id: string;
  summary: string;
  type: string;
  date: string;
  timeOfDay: string;
}

export const CrimeSummarizer = () => {
  const [crimes, setCrimes] = useState<CrimeSummary[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCrimes = async (offset = 0) => {
    if (loading || (nextOffset === null && offset !== 0)) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the AI Guardian API
      // Use window.location.hostname to get the current host (works for both localhost and IP address)
      const host = window.location.hostname;
      const response = await fetch(`http://${host}:3002/api/crimes?offset=${offset}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch crimes');
      }
      
      const newCrimes = data.crimes.map((crime: any) => ({
        id: crime.id,
        summary: crime.summary,
        type: crime.type,
        date: crime.date,
        timeOfDay: crime.timeOfDay
      }));
      
      if (offset === 0) {
        // Reset crimes if loading from the beginning
        setCrimes(newCrimes);
      } else {
        // Append crimes if loading more
        setCrimes(prev => [...prev, ...newCrimes]);
      }
      
      setNextOffset(data.nextOffset);
      
      if (newCrimes.length === 0 && offset === 0) {
        setError('No crime reports available');
      }
    } catch (err: any) {
      console.error('Error loading crimes:', err);
      setError(err?.message || 'Failed to load crime reports');
      toast.error('Failed to load crime reports', {
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== 
      document.documentElement.offsetHeight || 
      loading
    ) return;
    loadCrimes(nextOffset);
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, nextOffset]);

  useEffect(() => {
    loadCrimes();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Recent Crime Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm">
            Error loading crime data: {error}
          </div>
        )}

        {crimes.length > 0 ? (
          crimes.map(crime => (
            <div key={crime.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{crime.summary}</h3>
                <Badge variant="outline">{crime.type}</Badge>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {crime.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {crime.timeOfDay}
                </span>
              </div>
            </div>
          ))
        ) : !loading && !error ? (
          <div className="text-center py-8 text-gray-500">
            No crime reports available
          </div>
        ) : null}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {!loading && nextOffset !== null && crimes.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => loadCrimes(nextOffset)}
              className="flex items-center gap-2"
            >
              Load More
            </Button>
          </div>
        )}
        
        {!loading && error && crimes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-gray-500">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => loadCrimes(0)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};