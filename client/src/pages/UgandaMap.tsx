import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { MapView, MapUtils } from "@/components/Map";
import OpenStreetMap from "@/components/OpenStreetMap";
import UgandaMapComponent from "@/components/UgandaMapComponent";
import { motion } from "framer-motion";
import { MapPin, Building2, Users, Rocket, Map } from "lucide-react";

const UGANDA_REGIONS = [
  { name: "Central", center: { lat: 0.3476, lng: 32.5825 }, color: "#3b82f6", districts: ["Kampala", "Wakiso", "Mukono", "Mpigi", "Luwero", "Nakaseke", "Nakasongola", "Kayunga", "Buikwe", "Buvuma", "Kalangala", "Masaka", "Rakai", "Lyantonde", "Sembabule", "Kalungu", "Butambala", "Gomba", "Mityana", "Mubende", "Kiboga", "Kyankwanzi"] },
  { 
    name: "Eastern", 
    center: { lat: 1.0, lng: 33.5 }, 
    color: "#8b5cf6", 
    districts: ["Jinja", "Mbale", "Soroti", "Tororo", "Iganga", "Mayuge", "Kamuli", "Buyende", "Luuka", "Namutumba", "Bugiri", "Busia", "Manafwa", "Bududa", "Sironko", "Bulambuli", "Kapchorwa", "Kween", "Bukwo", "Pallisa", "Budaka", "Kibuku", "Serere", "Ngora", "Kumi", "Bukedea", "Kaberamaido", "Katakwi", "Amuria", "Napak", "Amudat", "Nakapiripirit", "Moroto", "Kotido", "Kaabong", "Abim"] 
  },
  { 
    name: "Northern", 
    center: { lat: 2.5, lng: 32.5 }, 
    color: "#ec4899", 
    districts: ["Gulu", "Lira", "Arua", "Kitgum", "Pader", "Agago", "Lamwo", "Amuru", "Nwoya", "Oyam", "Apac", "Kole", "Dokolo", "Alebtong", "Otuke", "Yumbe", "Moyo", "Adjumani", "Obongi", "Madi-Okollo", "Pakwach", "Nebbi", "Zombo", "Koboko"] 
  },
  { 
    name: "Western", 
    center: { lat: 0.0, lng: 30.5 }, 
    color: "#10b981", 
    districts: ["Mbarara", "Fort Portal", "Kasese", "Kabale", "Bushenyi", "Ntungamo", "Rukungiri", "Kanungu", "Kisoro", "Rubanda", "Mitooma", "Sheema", "Buhweju", "Rubirizi", "Ibanda", "Isingiro", "Kiruhura", "Lwengo", "Hoima", "Masindi", "Kibaale", "Kakumiro", "Kiryandongo", "Buliisa", "Bundibugyo", "Ntoroko", "Kabarole", "Kamwenge", "Kyenjojo", "Kyegegwa", "Bunyangabu"] 
  },
];

// All Uganda districts for reference (kept for potential future use)
const ALL_DISTRICTS = UGANDA_REGIONS.flatMap(region => region.districts).sort();

export default function UgandaMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [mapServices, setMapServices] = useState<{
    map: google.maps.Map;
    placesService: google.maps.places.PlacesService;
    geocoder: google.maps.Geocoder;
  } | null>(null);
  const [mapType, setMapType] = useState<'openstreet' | 'google' | 'simple'>('openstreet');

  const { data: hubs } = trpc.hubs.list.useQuery({ status: "approved" });
  const { data: communities } = trpc.communities.list.useQuery({ status: "approved" });
  const { data: startups } = trpc.startups.list.useQuery({ status: "approved" });

  const allEntities = useMemo(() => [
    ...(hubs || []).map(h => ({ ...h, type: "hub", color: "#3b82f6" })),
    ...(communities || []).map(c => ({ ...c, type: "community", color: "#8b5cf6" })),
    ...(startups || []).map(s => ({ ...s, type: "startup", color: "#ec4899" })),
  ], [hubs, communities, startups]);

  const filteredEntities = useMemo(() => {
    let filtered = allEntities;
    
    if (selectedRegion) {
      const region = UGANDA_REGIONS.find(r => r.name === selectedRegion);
      if (region) {
        filtered = filtered.filter(e => 
          e.location && region.districts.some(district => 
            e.location!.toLowerCase().includes(district.toLowerCase())
          )
        );
      }
    }
    
    return filtered;
  }, [allEntities, selectedRegion]);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    const placesService = new google.maps.places.PlacesService(map);
    const geocoder = new google.maps.Geocoder();
    setMapServices({ map, placesService, geocoder });

    // Set initial view to Uganda with proper bounds
    const ugandaBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-1.4823, 29.5732), // Southwest corner
      new google.maps.LatLng(4.2144, 35.0078)   // Northeast corner
    );
    map.fitBounds(ugandaBounds);
    
    // Add Uganda regions as overlays
    UGANDA_REGIONS.forEach(region => {
      const circle = new google.maps.Circle({
        strokeColor: region.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: region.color,
        fillOpacity: 0.1,
        map: map,
        center: region.center,
        radius: 100000, // 100km radius
      });

      // Add region label
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0; color: ${region.color}; font-weight: 600;">${region.name} Region</h3>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
              Major districts: ${region.districts.join(', ')}
            </p>
          </div>
        `,
        position: region.center,
      });

      circle.addListener('click', () => {
        handleRegionClick(region.name);
        infoWindow.open(map);
      });
    });
  };

  useEffect(() => {
    if (!mapServices) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add markers for entities with locations
    filteredEntities.forEach(async (entity) => {
      if (!entity.location) return;

      try {
        const results = await MapUtils.geocodeAddress(
          mapServices.geocoder, 
          `${entity.location}, Uganda`
        );
        
        if (results && results[0]) {
          const marker = MapUtils.createMarker(
            mapServices.map,
            results[0].geometry.location.toJSON(),
            {
              title: entity.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: entity.color,
                fillOpacity: 0.9,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              },
            }
          );

          const infoWindow = MapUtils.createInfoWindow(`
            <div style="padding: 12px; max-width: 250px; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 16px;">${entity.name}</h3>
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${entity.color}; margin-right: 6px;"></span>
                <span style="font-size: 13px; color: #6b7280; text-transform: capitalize; font-weight: 500;">${entity.type}</span>
              </div>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280; display: flex; align-items: center;">
                <svg style="width: 12px; height: 12px; margin-right: 4px;" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                ${entity.location}
              </p>
              ${entity.description ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #4b5563; line-height: 1.4;">${entity.description.substring(0, 120)}${entity.description.length > 120 ? '...' : ''}</p>` : ''}
            </div>
          `);

          marker.addListener("click", () => {
            infoWindow.open(mapServices.map, marker);
          });

          newMarkers.push(marker);
        }
      } catch (error) {
        console.warn(`Failed to geocode location: ${entity.location}`, error);
      }
    });

    setMarkers(newMarkers);
  }, [mapServices, filteredEntities]);

  const handleRegionClick = (regionName: string) => {
    if (selectedRegion === regionName) {
      setSelectedRegion(null);
      if (mapRef.current) {
        mapRef.current.setCenter({ lat: 1.3733, lng: 32.2903 });
        mapRef.current.setZoom(7);
      }
    } else {
      setSelectedRegion(regionName);
      const region = UGANDA_REGIONS.find(r => r.name === regionName);
      if (region && mapRef.current) {
        mapRef.current.setCenter(region.center);
        mapRef.current.setZoom(9);
      }
    }
  };

  const stats = [
    { label: "Total Entities", value: allEntities.length, icon: MapPin, color: "text-blue-500" },
    { label: "Tech Hubs", value: hubs?.length || 0, icon: Building2, color: "text-blue-500" },
    { label: "Communities", value: communities?.length || 0, icon: Users, color: "text-purple-500" },
    { label: "Startups", value: startups?.length || 0, icon: Rocket, color: "text-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
                Uganda Tech Map
              </h1>
              <p className="text-lg text-muted-foreground">
                Interactive visualization of Uganda's tech ecosystem
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <MapPin className="h-5 w-5 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">All Locations</p>
                <p className="text-sm text-muted-foreground">{allEntities.length} Total</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <Building2 className="h-5 w-5 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">Hubs ({hubs?.length || 0})</p>
                <p className="text-sm text-muted-foreground">Tech Spaces</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <Users className="h-5 w-5 text-purple-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">Communities ({communities?.length || 0})</p>
                <p className="text-sm text-muted-foreground">Developer Groups</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <Rocket className="h-5 w-5 text-pink-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">Startups ({startups?.length || 0})</p>
                <p className="text-sm text-muted-foreground">Tech Companies</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Map className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    <strong>Choose Your Map Experience:</strong> OpenStreetMap is completely free and open-source, 
                    while Google Maps offers advanced features but requires an API key.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={mapType === 'openstreet' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapType('openstreet')}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      OpenStreetMap (Free)
                    </Button>
                    <Button
                      variant={mapType === 'google' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapType('google')}
                    >
                      Google Maps
                    </Button>
                    <Button
                      variant={mapType === 'simple' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapType('simple')}
                    >
                      Simple Map
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {mapType === 'openstreet' ? (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <OpenStreetMap
                  entities={allEntities}
                  regions={UGANDA_REGIONS}
                  selectedRegion={selectedRegion}
                  onRegionClick={handleRegionClick}
                  className="h-[600px]"
                />
              </CardContent>
            </Card>
          ) : mapType === 'google' ? (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <MapView 
                    onMapReady={handleMapReady}
                    initialCenter={{ lat: 1.3733, lng: 32.2903 }}
                    initialZoom={7}
                    mapOptions={{
                      restriction: {
                        latLngBounds: {
                          north: 4.2144,
                          south: -1.4823,
                          east: 35.0078,
                          west: 29.5732,
                        },
                        strictBounds: false,
                      },
                      minZoom: 6,
                      maxZoom: 18,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <UgandaMapComponent />
          )}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Map Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm text-muted-foreground">Tech Hubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <span className="text-sm text-muted-foreground">Communities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-500" />
                  <span className="text-sm text-muted-foreground">Startups</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


      </div>
    </div>
  );
}
