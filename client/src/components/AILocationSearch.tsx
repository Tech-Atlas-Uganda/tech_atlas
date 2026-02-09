import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Sparkles, Loader2, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AILocationSearchProps {
  onLocationFound?: (lat: number, lng: number) => void;
}

export function AILocationSearch({ onLocationFound }: AILocationSearchProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [gettingLocation, setGettingLocation] = useState(false);

  const enableLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        onLocationFound?.(location.lat, location.lng);
        toast.success('Location enabled!');
        setGettingLocation(false);
      },
      (error) => {
        toast.error('Failed to get location');
        console.error(error);
        setGettingLocation(false);
      }
    );
  };

  const searchNearby = async () => {
    if (!userLocation) {
      toast.error('Please enable location first');
      return;
    }

    if (!searchQuery.trim()) {
      toast.error('Enter what you\'re looking for');
      return;
    }

    setSearching(true);
    setResults([]);

    try {
      const response = await fetch('/api/location-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          latitude: userLocation.lat,
          longitude: userLocation.lng
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Search failed');
        throw new Error(data.message);
      }

      setResults(data.results || []);
      toast.success(`Found ${data.results?.length || 0} results`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold text-lg">AI Location Search</h3>
        </div>

        {!userLocation ? (
          <div className="text-center py-6">
            <Navigation className="h-12 w-12 mx-auto text-purple-500 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Enable your location to find nearby tech hubs, startups, events, and more
            </p>
            <Button 
              onClick={enableLocation}
              disabled={gettingLocation}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {gettingLocation ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Enable Location
                </>
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <MapPin className="h-4 w-4" />
              <span>Location enabled</span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Find startups, hubs, events near me..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchNearby()}
                className="flex-1"
              />
              <Button 
                onClick={searchNearby}
                disabled={searching}
                className="gap-2"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Search
              </Button>
            </div>

            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 max-h-64 overflow-y-auto"
                >
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-background rounded-lg border hover:border-purple-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          result.type === 'hub' ? 'bg-blue-500' :
                          result.type === 'startup' ? 'bg-pink-500' :
                          result.type === 'event' ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{result.name}</h4>
                          <p className="text-xs text-muted-foreground">{result.location}</p>
                          {result.distance && (
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                              {result.distance}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
