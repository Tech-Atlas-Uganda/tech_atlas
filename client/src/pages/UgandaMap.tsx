import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import { motion } from "framer-motion";
import { MapPin, Building2, Users, Rocket, TrendingUp, Filter } from "lucide-react";

const UGANDA_REGIONS = [
  { name: "Central", center: { lat: 0.3476, lng: 32.5825 }, color: "#3b82f6" },
  { name: "Eastern", center: { lat: 1.0, lng: 33.5 }, color: "#8b5cf6" },
  { name: "Northern", center: { lat: 2.5, lng: 32.5 }, color: "#ec4899" },
  { name: "Western", center: { lat: 0.0, lng: 30.5 }, color: "#10b981" },
];

export default function UgandaMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [mapServices, setMapServices] = useState<{
    map: google.maps.Map;
    placesService: google.maps.places.PlacesService;
    geocoder: google.maps.Geocoder;
  } | null>(null);

  const { data: hubs } = trpc.hubs.list.useQuery({ status: "approved" });
  const { data: communities } = trpc.communities.list.useQuery({ status: "approved" });
  const { data: startups } = trpc.startups.list.useQuery({ status: "approved" });

  const allEntities = [
    ...(hubs || []).map(h => ({ ...h, type: "hub", color: "#3b82f6" })),
    ...(communities || []).map(c => ({ ...c, type: "community", color: "#8b5cf6" })),
    ...(startups || []).map(s => ({ ...s, type: "startup", color: "#ec4899" })),
  ];

  const filteredEntities = selectedRegion
    ? allEntities.filter(e => e.location?.toLowerCase().includes(selectedRegion.toLowerCase()))
    : allEntities;

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    const placesService = new google.maps.places.PlacesService(map);
    const geocoder = new google.maps.Geocoder();
    setMapServices({ map, placesService, geocoder });

    // Set initial view to Uganda
    map.setCenter({ lat: 1.3733, lng: 32.2903 });
    map.setZoom(7);
  };

  useEffect(() => {
    if (!mapServices) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: google.maps.Marker[] = [];

    // Add markers for entities with locations
    filteredEntities.forEach(entity => {
      if (!entity.location) return;

      mapServices.geocoder.geocode(
        { address: `${entity.location}, Uganda` },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            const marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: mapServices.map,
              title: entity.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: entity.color,
                fillOpacity: 0.8,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="margin: 0 0 4px 0; font-weight: 600; color: #1f2937;">${entity.name}</h3>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${entity.color}; margin-right: 4px;"></span>
                    ${entity.type}
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">${entity.location}</p>
                  ${entity.description ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #4b5563;">${entity.description.substring(0, 100)}...</p>` : ''}
                </div>
              `,
            });

            marker.addListener("click", () => {
              infoWindow.open(mapServices.map, marker);
            });

            newMarkers.push(marker);
          }
        }
      );
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
            Uganda Tech Map
          </h1>
          <p className="text-lg text-muted-foreground">
            Interactive visualization of Uganda's technology ecosystem across all regions
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <Icon className={`h-5 w-5 ${stat.color} mb-2`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Region Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Filter by Region</CardTitle>
              </div>
              <CardDescription>
                Click on a region to focus the map and filter entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {UGANDA_REGIONS.map((region) => (
                  <Button
                    key={region.name}
                    variant={selectedRegion === region.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRegionClick(region.name)}
                    className="transition-all"
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: region.color }}
                    />
                    {region.name}
                  </Button>
                ))}
                {selectedRegion && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedRegion(null);
                      if (mapRef.current) {
                        mapRef.current.setCenter({ lat: 1.3733, lng: 32.2903 });
                        mapRef.current.setZoom(7);
                      }
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
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
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[600px] w-full">
                <MapView onMapReady={handleMapReady} />
              </div>
            </CardContent>
          </Card>
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

        {/* Filtered Results */}
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedRegion} Region - {filteredEntities.length} Entities
                </CardTitle>
                <CardDescription>
                  Showing all tech ecosystem entities in {selectedRegion} Uganda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEntities.map((entity) => (
                    <Card key={`${entity.type}-${entity.id}`} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-1">{entity.name}</CardTitle>
                          <Badge
                            variant="outline"
                            style={{ borderColor: entity.color, color: entity.color }}
                          >
                            {entity.type}
                          </Badge>
                        </div>
                        {entity.location && (
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entity.location}
                          </CardDescription>
                        )}
                      </CardHeader>
                      {entity.description && (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {entity.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
