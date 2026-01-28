import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Building2, Users, Rocket, MapPin, Search, Plus, Map as MapIcon, List } from "lucide-react";
import { motion } from "framer-motion";
import { MapView } from "@/components/Map";

type EntityType = "hub" | "community" | "startup";

interface Entity {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  address?: string | null;
  verified?: boolean;
  focusAreas?: string[] | null;
  type?: string | null;
  memberCount?: number | null;
  stage?: string | null;
  industry?: string | null;
}

export default function Ecosystem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hubs");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const { data: hubs, isLoading: hubsLoading } = trpc.hubs.list.useQuery({ status: "approved" });
  const { data: communities, isLoading: communitiesLoading } = trpc.communities.list.useQuery({ status: "approved" });
  const { data: startups, isLoading: startupsLoading } = trpc.startups.list.useQuery({ status: "approved" });

  const filterItems = (items: any[] | undefined, query: string, location: string) => {
    if (!items) return [];
    let filtered = items;
    
    if (query) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.location?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (location) {
      filtered = filtered.filter(item =>
        item.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredHubs = filterItems(hubs, searchQuery, selectedLocation);
  const filteredCommunities = filterItems(communities, searchQuery, selectedLocation);
  const filteredStartups = filterItems(startups, searchQuery, selectedLocation);

  const getCurrentEntities = (): { entities: Entity[]; type: EntityType } => {
    switch (activeTab) {
      case "hubs":
        return { entities: filteredHubs, type: "hub" };
      case "communities":
        return { entities: filteredCommunities, type: "community" };
      case "startups":
        return { entities: filteredStartups, type: "startup" };
      default:
        return { entities: [], type: "hub" };
    }
  };

  const getUniqueLocations = () => {
    const allEntities = [...(hubs || []), ...(communities || []), ...(startups || [])];
    const locations = allEntities
      .map(e => e.location)
      .filter((loc): loc is string => !!loc);
    return Array.from(new Set(locations)).sort();
  };

  const initializeMap = (map: google.maps.Map) => {
    mapRef.current = map;
    geocoderRef.current = new window.google.maps.Geocoder();
    
    // Center on Uganda
    map.setCenter({ lat: 0.3476, lng: 32.5825 });
    map.setZoom(7);
    
    updateMapMarkers();
  };

  const updateMapMarkers = async () => {
    if (!mapRef.current || !geocoderRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    const { entities, type } = getCurrentEntities();
    const bounds = new window.google.maps.LatLngBounds();
    let markersAdded = 0;

    for (const entity of entities) {
      const locationStr = entity.address || entity.location;
      if (!locationStr) continue;

      try {
        const result = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
          geocoderRef.current!.geocode(
            { address: `${locationStr}, Uganda` },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                resolve(results[0]);
              } else {
                resolve(null);
              }
            }
          );
        });

        if (!result) continue;

        const position = result.geometry.location;
        bounds.extend(position);

        // Create custom marker content
        const markerContent = document.createElement("div");
        markerContent.className = "flex items-center justify-center w-10 h-10 rounded-full shadow-lg cursor-pointer";
        markerContent.style.backgroundColor = type === "hub" ? "#6366f1" : type === "community" ? "#8b5cf6" : "#ec4899";
        
        const icon = document.createElement("div");
        icon.innerHTML = type === "hub" 
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>'
          : type === "community"
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
        markerContent.appendChild(icon);

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position,
          content: markerContent,
          title: entity.name,
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${entity.name}</h3>
              ${entity.verified ? '<span style="background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Verified</span>' : ''}
              <p style="color: #64748b; font-size: 14px; margin-top: 8px;">${entity.description || 'No description available'}</p>
              ${entity.location ? `<p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">📍 ${entity.location}</p>` : ''}
              <a href="/ecosystem/${type}s/${entity.slug}" style="color: #6366f1; font-size: 14px; margin-top: 8px; display: inline-block;">View Details →</a>
            </div>
          `,
        });

        markerContent.addEventListener("click", () => {
          infoWindow.open(mapRef.current, marker);
        });

        markersRef.current.push(marker);
        markersAdded++;
      } catch (error) {
        console.warn(`Failed to geocode ${entity.name}:`, error);
      }
    }

    // Fit bounds if markers were added
    if (markersAdded > 0) {
      mapRef.current.fitBounds(bounds);
      // Prevent zooming in too much for single marker
      const listener = window.google.maps.event.addListener(mapRef.current, "idle", () => {
        if (mapRef.current!.getZoom()! > 15) {
          mapRef.current!.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  };

  useEffect(() => {
    if (viewMode === "map") {
      updateMapMarkers();
    }
  }, [activeTab, searchQuery, selectedLocation, viewMode, hubs, communities, startups]);

  const renderEntityCard = (entity: Entity, index: number, type: EntityType) => (
    <motion.div
      key={entity.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/ecosystem/${type}s/${entity.slug}`}>
        <a>
          <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-xl">{entity.name}</CardTitle>
                {entity.verified && (
                  <Badge variant="secondary" className="ml-2">Verified</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                {entity.location && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {entity.location}
                  </div>
                )}
                {entity.type && (
                  <Badge variant="outline" className="text-xs">{entity.type}</Badge>
                )}
                {entity.memberCount && (
                  <span className="text-xs">{entity.memberCount} members</span>
                )}
                {entity.stage && (
                  <Badge variant="outline" className="text-xs">{entity.stage}</Badge>
                )}
                {entity.industry && (
                  <span className="text-xs">{entity.industry}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 mb-4">
                {entity.description || "No description available"}
              </CardDescription>
              {entity.focusAreas && entity.focusAreas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entity.focusAreas.slice(0, 3).map((area: string) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {entity.focusAreas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{entity.focusAreas.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </a>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
                Ecosystem Map
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover tech hubs, communities, and startups across Uganda
              </p>
            </div>
            <Button asChild>
              <Link href="/submit/hub">
                <a className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your Organization
                </a>
              </Link>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="">All Locations</option>
                {getUniqueLocations().map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="rounded-none"
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="hubs" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Hubs ({filteredHubs.length})
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Communities ({filteredCommunities.length})
            </TabsTrigger>
            <TabsTrigger value="startups" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Startups ({filteredStartups.length})
            </TabsTrigger>
          </TabsList>

          {/* Map View */}
          {viewMode === "map" && (
            <div className="mt-8">
              <Card>
                <CardContent className="p-0">
                  <MapView
                    className="w-full h-[600px] rounded-lg"
                    onMapReady={initializeMap}
                  />
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Click on markers to view details. Showing {getCurrentEntities().entities.length} {activeTab}.
              </p>
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <>
              {/* Hubs Tab */}
              <TabsContent value="hubs" className="mt-8">
                {hubsLoading ? (
                  <div className="text-center py-12">Loading hubs...</div>
                ) : filteredHubs.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hubs found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHubs.map((hub, index) => renderEntityCard(hub, index, "hub"))}
                  </div>
                )}
              </TabsContent>

              {/* Communities Tab */}
              <TabsContent value="communities" className="mt-8">
                {communitiesLoading ? (
                  <div className="text-center py-12">Loading communities...</div>
                ) : filteredCommunities.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No communities found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunities.map((community, index) => renderEntityCard(community, index, "community"))}
                  </div>
                )}
              </TabsContent>

              {/* Startups Tab */}
              <TabsContent value="startups" className="mt-8">
                {startupsLoading ? (
                  <div className="text-center py-12">Loading startups...</div>
                ) : filteredStartups.length === 0 ? (
                  <div className="text-center py-12">
                    <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No startups found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStartups.map((startup, index) => renderEntityCard(startup, index, "startup"))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
