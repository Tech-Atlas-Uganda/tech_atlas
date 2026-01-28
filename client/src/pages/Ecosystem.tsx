import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Building2, Users, Rocket, MapPin, ExternalLink, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Ecosystem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hubs");

  const { data: hubs, isLoading: hubsLoading } = trpc.hubs.list.useQuery({ status: "approved" });
  const { data: communities, isLoading: communitiesLoading } = trpc.communities.list.useQuery({ status: "approved" });
  const { data: startups, isLoading: startupsLoading } = trpc.startups.list.useQuery({ status: "approved" });

  const filterItems = (items: any[] | undefined, query: string) => {
    if (!items) return [];
    if (!query) return items;
    return items.filter(item =>
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.location?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredHubs = filterItems(hubs, searchQuery);
  const filteredCommunities = filterItems(communities, searchQuery);
  const filteredStartups = filterItems(startups, searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
              <Link href="/ecosystem/submit">
                <a className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your Organization
                </a>
              </Link>
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                {filteredHubs.map((hub, index) => (
                  <motion.div
                    key={hub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/ecosystem/hubs/${hub.slug}`}>
                      <a>
                        <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl">{hub.name}</CardTitle>
                              {hub.verified && (
                                <Badge variant="secondary" className="ml-2">Verified</Badge>
                              )}
                            </div>
                            {hub.location && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {hub.location}
                              </div>
                            )}
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-3 mb-4">
                              {hub.description || "No description available"}
                            </CardDescription>
                            {hub.focusAreas && hub.focusAreas.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {hub.focusAreas.slice(0, 3).map((area: string) => (
                                  <Badge key={area} variant="outline" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                                {hub.focusAreas.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{hub.focusAreas.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  </motion.div>
                ))}
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
                {filteredCommunities.map((community, index) => (
                  <motion.div
                    key={community.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/ecosystem/communities/${community.slug}`}>
                      <a>
                        <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl">{community.name}</CardTitle>
                              {community.verified && (
                                <Badge variant="secondary" className="ml-2">Verified</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {community.type && (
                                <Badge variant="outline" className="text-xs">{community.type}</Badge>
                              )}
                              {community.memberCount && (
                                <span>{community.memberCount} members</span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-3 mb-4">
                              {community.description || "No description available"}
                            </CardDescription>
                            {community.focusAreas && community.focusAreas.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {community.focusAreas.slice(0, 3).map((area: string) => (
                                  <Badge key={area} variant="outline" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                                {community.focusAreas.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{community.focusAreas.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  </motion.div>
                ))}
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
                {filteredStartups.map((startup, index) => (
                  <motion.div
                    key={startup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/ecosystem/startups/${startup.slug}`}>
                      <a>
                        <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl">{startup.name}</CardTitle>
                              {startup.verified && (
                                <Badge variant="secondary" className="ml-2">Verified</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {startup.stage && (
                                <Badge variant="outline" className="text-xs">{startup.stage}</Badge>
                              )}
                              {startup.industry && (
                                <span className="text-xs">{startup.industry}</span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-3 mb-4">
                              {startup.description || "No description available"}
                            </CardDescription>
                            {startup.focusAreas && startup.focusAreas.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {startup.focusAreas.slice(0, 3).map((area: string) => (
                                  <Badge key={area} variant="outline" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                                {startup.focusAreas.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{startup.focusAreas.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
