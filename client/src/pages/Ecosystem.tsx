import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Users, Rocket, MapPin, Search, Plus, Map as MapIcon, List, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { MapView } from "@/components/Map";
import { toast } from "sonner";

type EntityType = "hub" | "community" | "startup";

// All Uganda districts for filtering
const ALL_DISTRICTS = [
  // Central Region
  "Kampala", "Wakiso", "Mukono", "Mpigi", "Luwero", "Nakaseke", "Nakasongola", "Kayunga", "Buikwe", "Buvuma", "Kalangala", "Masaka", "Rakai", "Lyantonde", "Sembabule", "Kalungu", "Butambala", "Gomba", "Mityana", "Mubende", "Kiboga", "Kyankwanzi",
  // Eastern Region  
  "Jinja", "Mbale", "Soroti", "Tororo", "Iganga", "Mayuge", "Kamuli", "Buyende", "Luuka", "Namutumba", "Bugiri", "Busia", "Manafwa", "Bududa", "Sironko", "Bulambuli", "Kapchorwa", "Kween", "Bukwo", "Pallisa", "Budaka", "Kibuku", "Serere", "Ngora", "Kumi", "Bukedea", "Kaberamaido", "Katakwi", "Amuria", "Napak", "Amudat", "Nakapiripirit", "Moroto", "Kotido", "Kaabong", "Abim",
  // Northern Region
  "Gulu", "Lira", "Arua", "Kitgum", "Pader", "Agago", "Lamwo", "Amuru", "Nwoya", "Oyam", "Apac", "Kole", "Dokolo", "Alebtong", "Otuke", "Yumbe", "Moyo", "Adjumani", "Obongi", "Madi-Okollo", "Pakwach", "Nebbi", "Zombo", "Koboko",
  // Western Region
  "Mbarara", "Fort Portal", "Kasese", "Kabale", "Bushenyi", "Ntungamo", "Rukungiri", "Kanungu", "Kisoro", "Rubanda", "Mitooma", "Sheema", "Buhweju", "Rubirizi", "Ibanda", "Isingiro", "Kiruhura", "Lwengo", "Hoima", "Masindi", "Kibaale", "Kakumiro", "Kiryandongo", "Buliisa", "Bundibugyo", "Ntoroko", "Kabarole", "Kamwenge", "Kyenjojo", "Kyegegwa", "Bunyangabu"
].sort();

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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hubs");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [showSubmissionModal, setShowSubmissionModal] = useState<'hub' | 'community' | 'startup' | null>(null);
  const [submissionForm, setSubmissionForm] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    email: '',
    phone: '',
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // Show all approved content immediately (anonymous submissions are auto-approved)
  const { data: hubs, isLoading: hubsLoading, refetch: refetchHubs } = trpc.hubs.list.useQuery({ status: "approved" });
  const { data: communities, isLoading: communitiesLoading, refetch: refetchCommunities } = trpc.communities.list.useQuery({ status: "approved" });
  const { data: startups, isLoading: startupsLoading, refetch: refetchStartups } = trpc.startups.list.useQuery({ status: "approved" });

  // Submission mutations
  const createHubMutation = trpc.hubs.create.useMutation();
  const createCommunityMutation = trpc.communities.create.useMutation();
  const createStartupMutation = trpc.startups.create.useMutation();

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
    
    if (location && location.trim() !== "" && location !== "all") {
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
    return ALL_DISTRICTS;
  };

  const handleSubmissionFormChange = (field: string, value: string) => {
    setSubmissionForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmissionSubmit = async () => {
    if (!submissionForm.name || !submissionForm.description || !submissionForm.location || !submissionForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const baseData = {
        name: submissionForm.name,
        description: submissionForm.description,
        location: submissionForm.location,
        email: submissionForm.email,
        website: submissionForm.website || undefined,
        phone: submissionForm.phone || undefined,
      };

      console.log('Submitting:', showSubmissionModal, baseData);

      let result;
      if (showSubmissionModal === 'hub') {
        result = await createHubMutation.mutateAsync(baseData);
        console.log('Hub created:', result);
      } else if (showSubmissionModal === 'community') {
        result = await createCommunityMutation.mutateAsync(baseData);
        console.log('Community created:', result);
      } else if (showSubmissionModal === 'startup') {
        result = await createStartupMutation.mutateAsync(baseData);
        console.log('Startup created:', result);
      }

      // Reset form and close modal
      setSubmissionForm({
        name: '',
        description: '',
        location: '',
        website: '',
        email: '',
        phone: '',
      });
      setShowSubmissionModal(null);
      
      // Refetch data to show the new submission immediately
      refetchHubs();
      refetchCommunities();
      refetchStartups();
      
      // Show success toast
      toast.success(
        `${showSubmissionModal?.charAt(0).toUpperCase()}${showSubmissionModal?.slice(1)} submitted successfully!`,
        {
          description: "Your submission is now live on the platform. Moderators will review and remove any inappropriate content.",
          duration: 5000,
          action: {
            label: "View",
            onClick: () => {
              // Scroll to the relevant tab
              setActiveTab(showSubmissionModal === 'hub' ? 'hubs' : showSubmissionModal === 'community' ? 'communities' : 'startups');
            }
          }
        }
      );
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit', {
        description: error.message || 'Please try again later.',
        duration: 4000
      });
    }
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
                <div className="flex items-center gap-2 ml-2">
                  {entity.verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
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
            <div className="flex flex-col md:flex-row gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4" />
                    Add Your Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Organization Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 py-4">
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-auto p-4"
                      onClick={() => setShowSubmissionModal('hub')}
                    >
                      <Building2 className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">Tech Hub</div>
                        <div className="text-sm text-muted-foreground">Co-working spaces, incubators, accelerators</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-auto p-4"
                      onClick={() => setShowSubmissionModal('community')}
                    >
                      <Users className="h-5 w-5 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">Community</div>
                        <div className="text-sm text-muted-foreground">Developer groups, meetups, organizations</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-auto p-4"
                      onClick={() => setShowSubmissionModal('startup')}
                    >
                      <Rocket className="h-5 w-5 text-pink-500" />
                      <div className="text-left">
                        <div className="font-medium">Startup</div>
                        <div className="text-sm text-muted-foreground">Tech companies, startups, businesses</div>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
              <div className="flex items-center gap-2">
                <Select value={selectedLocation || undefined} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {ALL_DISTRICTS.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLocation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLocation("")}
                    className="px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
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

        {/* Submission Modals */}
        <Dialog open={!!showSubmissionModal} onOpenChange={() => setShowSubmissionModal(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {showSubmissionModal === 'hub' && <Building2 className="h-5 w-5 text-blue-500" />}
                {showSubmissionModal === 'community' && <Users className="h-5 w-5 text-purple-500" />}
                {showSubmissionModal === 'startup' && <Rocket className="h-5 w-5 text-pink-500" />}
                Add {showSubmissionModal === 'hub' ? 'Tech Hub' : showSubmissionModal === 'community' ? 'Community' : 'Startup'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={submissionForm.name}
                  onChange={(e) => handleSubmissionFormChange('name', e.target.value)}
                  placeholder={`Enter ${showSubmissionModal} name`}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={submissionForm.description}
                  onChange={(e) => handleSubmissionFormChange('description', e.target.value)}
                  placeholder="Describe what you do, your mission, or services offered"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select value={submissionForm.location} onValueChange={(value) => handleSubmissionFormChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={submissionForm.website}
                  onChange={(e) => handleSubmissionFormChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={submissionForm.email}
                  onChange={(e) => handleSubmissionFormChange('email', e.target.value)}
                  placeholder="contact@yourorganization.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={submissionForm.phone}
                  onChange={(e) => handleSubmissionFormChange('phone', e.target.value)}
                  placeholder="+256 XXX XXX XXX"
                />
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Anonymous Submission:</strong> Your submission will appear immediately on the platform. Moderators will review and remove any inappropriate, duplicate, or irrelevant content.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmissionSubmit}
                  disabled={!submissionForm.name || !submissionForm.description || !submissionForm.location || !submissionForm.email || createHubMutation.isLoading || createCommunityMutation.isLoading || createStartupMutation.isLoading}
                  className="flex-1"
                >
                  {(createHubMutation.isLoading || createCommunityMutation.isLoading || createStartupMutation.isLoading) ? 'Submitting...' : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit & Publish
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowSubmissionModal(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
