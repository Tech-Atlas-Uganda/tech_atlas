/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
    initMap?: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for the existing script to load
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'your-google-maps-api-key-here') {
      console.warn('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      resolve();
    };
    
    script.onerror = (error) => {
      console.error("Failed to load Google Maps script:", error);
      reject(error);
    };
    
    document.head.appendChild(script);
  });
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
  mapOptions?: Partial<google.maps.MapOptions>;
}

export function MapView({
  className,
  initialCenter = { lat: 1.3733, lng: 32.2903 }, // Uganda center
  initialZoom = 7,
  onMapReady,
  mapOptions = {},
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeMap = usePersistFn(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await loadGoogleMapsScript();
      
      if (!mapContainer.current) {
        throw new Error("Map container not found");
      }

      const defaultMapOptions: google.maps.MapOptions = {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        scaleControl: true,
        rotateControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'cooperative',
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
        ...mapOptions,
      };

      map.current = new window.google!.maps.Map(mapContainer.current, defaultMapOptions);
      
      if (onMapReady && map.current) {
        onMapReady(map.current);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error initializing map:", err);
      setError(err instanceof Error ? err.message : "Failed to load map");
      setIsLoading(false);
    }
  });

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  if (error) {
    return (
      <div className={cn("w-full h-[500px] flex items-center justify-center bg-muted rounded-lg", className)}>
        <div className="text-center p-6">
          <div className="text-muted-foreground mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground mb-2">Map Unavailable</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {error}
          </p>
          {error.includes('API key') && (
            <p className="text-xs text-muted-foreground mt-2">
              Configure VITE_GOOGLE_MAPS_API_KEY in your environment variables
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-[500px]", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapContainer} 
        className={cn("w-full h-full rounded-lg", isLoading && "opacity-0")} 
      />
    </div>
  );
}

// Utility functions for common map operations
export const MapUtils = {
  // Create a marker
  createMarker: (
    map: google.maps.Map,
    position: google.maps.LatLngLiteral,
    options?: Partial<google.maps.MarkerOptions>
  ) => {
    return new google.maps.Marker({
      position,
      map,
      ...options,
    });
  },

  // Create an info window
  createInfoWindow: (content: string | HTMLElement) => {
    return new google.maps.InfoWindow({
      content,
    });
  },

  // Geocode an address
  geocodeAddress: (
    geocoder: google.maps.Geocoder,
    address: string
  ): Promise<google.maps.GeocoderResult[]> => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  },

  // Fit map to bounds
  fitToBounds: (map: google.maps.Map, bounds: google.maps.LatLngBounds) => {
    map.fitBounds(bounds);
  },

  // Create bounds from coordinates
  createBounds: (coordinates: google.maps.LatLngLiteral[]) => {
    const bounds = new google.maps.LatLngBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    return bounds;
  },
};