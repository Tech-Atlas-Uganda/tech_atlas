import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons for different entity types
const createCustomIcon = (color: string, type: string) => {
  const svgIcon = `
    <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12.5" r="10" fill="${color}" stroke="white" stroke-width="3"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white" opacity="0.8"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -12.5],
  });
};

interface Entity {
  id: number;
  name: string;
  location?: string;
  description?: string;
  type: string;
  color: string;
  coordinates?: { lat: number; lng: number };
}

interface Region {
  name: string;
  center: { lat: number; lng: number };
  color: string;
  districts: string[];
}

interface OpenStreetMapProps {
  className?: string;
  entities?: Entity[];
  regions?: Region[];
  selectedRegion?: string | null;
  onRegionClick?: (regionName: string) => void;
  center?: [number, number];
  zoom?: number;
}

// Component to handle map events and updates
function MapController({ 
  entities, 
  regions, 
  selectedRegion, 
  onRegionClick 
}: {
  entities?: Entity[];
  regions?: Region[];
  selectedRegion?: string | null;
  onRegionClick?: (regionName: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedRegion && regions) {
      const region = regions.find(r => r.name === selectedRegion);
      if (region) {
        map.setView([region.center.lat, region.center.lng], 9);
      }
    } else {
      // Reset to Uganda view
      map.setView([1.3733, 32.2903], 7);
    }
  }, [selectedRegion, regions, map]);

  return null;
}

export default function OpenStreetMap({
  className,
  entities = [],
  regions = [],
  selectedRegion,
  onRegionClick,
  center = [1.3733, 32.2903], // Uganda center
  zoom = 7,
}: OpenStreetMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Filter entities based on selected region
  const filteredEntities = selectedRegion
    ? entities.filter(e => 
        e.location?.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        (e.coordinates && regions.find(r => r.name === selectedRegion))
      )
    : entities;

  return (
    <div className={cn("w-full h-[600px] rounded-lg overflow-hidden", className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* Base map tiles from OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {/* Alternative tile layer - CartoDB Positron (cleaner look) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
        /> */}

        {/* Map controller for handling updates */}
        <MapController 
          entities={filteredEntities}
          regions={regions}
          selectedRegion={selectedRegion}
          onRegionClick={onRegionClick}
        />

        {/* Region circles */}
        {regions.map((region) => (
          <Circle
            key={region.name}
            center={[region.center.lat, region.center.lng]}
            radius={100000} // 100km radius
            pathOptions={{
              color: region.color,
              fillColor: region.color,
              fillOpacity: 0.1,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onRegionClick?.(region.name),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-1" style={{ color: region.color }}>
                  {region.name} Region
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Major districts: {region.districts.join(', ')}
                </p>
                <button
                  onClick={() => onRegionClick?.(region.name)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Focus Region
                </button>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Entity markers */}
        {filteredEntities.map((entity) => {
          // Use provided coordinates or default Uganda locations for demo
          const position: [number, number] = entity.coordinates 
            ? [entity.coordinates.lat, entity.coordinates.lng]
            : getDefaultPosition(entity.location || entity.name);

          return (
            <Marker
              key={`${entity.type}-${entity.id}`}
              position={position}
              icon={createCustomIcon(entity.color, entity.type)}
            >
              <Popup>
                <div className="p-3 max-w-xs">
                  <h3 className="font-semibold text-base mb-2">{entity.name}</h3>
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: entity.color }}
                    />
                    <span className="text-sm text-gray-600 capitalize font-medium">
                      {entity.type}
                    </span>
                  </div>
                  {entity.location && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {entity.location}
                    </p>
                  )}
                  {entity.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {entity.description.length > 100 
                        ? `${entity.description.substring(0, 100)}...` 
                        : entity.description
                      }
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

// Helper function to get default positions for entities without coordinates
function getDefaultPosition(location: string): [number, number] {
  const locationMap: Record<string, [number, number]> = {
    // Major Ugandan cities
    'kampala': [0.3476, 32.5825],
    'jinja': [0.4312, 33.2041],
    'mbale': [1.0827, 34.1755],
    'gulu': [2.7856, 32.2998],
    'mbarara': [-0.6107, 30.6591],
    'fort portal': [0.6710, 30.2748],
    'kasese': [0.1833, 30.0833],
    'soroti': [1.7147, 33.6111],
    'lira': [2.2490, 32.8998],
    'arua': [3.0197, 30.9107],
    'masaka': [-0.3540, 31.7340],
    'hoima': [1.4331, 31.3524],
    'kabale': [-1.2480, 29.9896],
    'mukono': [0.3533, 32.7553],
    'entebbe': [0.0564, 32.4647],
    'wakiso': [0.4044, 32.4597],
  };

  const key = location.toLowerCase();
  
  // Check for exact match
  if (locationMap[key]) {
    return locationMap[key];
  }
  
  // Check for partial match
  for (const [city, coords] of Object.entries(locationMap)) {
    if (key.includes(city) || city.includes(key)) {
      return coords;
    }
  }
  
  // Default to Kampala if no match found
  return [0.3476, 32.5825];
}

// Export utility functions for external use
export const MapUtils = {
  createCustomIcon,
  getDefaultPosition,
};