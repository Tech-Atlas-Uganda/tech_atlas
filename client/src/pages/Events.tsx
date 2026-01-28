import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Calendar as CalendarIcon, DollarSign, MapPin, Clock, Search, Plus, Video, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("events");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: events, isLoading: eventsLoading } = trpc.events.list.useQuery({ status: "approved", upcoming: true });
  const { data: opportunities, isLoading: opportunitiesLoading } = trpc.opportunities.list.useQuery({ status: "approved" });

  const filterEvents = (items: any[] | undefined) => {
    if (!items) return [];
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organizer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    return filtered;
  };

  const filterOpportunities = (items: any[] | undefined) => {
    if (!items) return [];
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredEvents = filterEvents(events);
  const filteredOpportunities = filterOpportunities(opportunities);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                Events & Opportunities
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover meetups, hackathons, grants, and fellowships
              </p>
            </div>
            <Button asChild>
              <Link href="/submit/event">
                <a className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event/Opportunity
                </a>
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events and opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "events" && (
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Events ({filteredEvents.length})
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Opportunities ({filteredOpportunities.length})
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-8">
            {eventsLoading ? (
              <div className="text-center py-12">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming events found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/events/${event.slug}`}>
                      <a>
                        <Card className="hover:shadow-lg transition-all hover:border-primary/50">
                          <CardHeader>
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Date Box */}
                              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex flex-col items-center justify-center text-white">
                                <div className="text-2xl font-bold">
                                  {new Date(event.startDate).getDate()}
                                </div>
                                <div className="text-xs uppercase">
                                  {new Date(event.startDate).toLocaleDateString("en-US", { month: "short" })}
                                </div>
                              </div>

                              {/* Event Details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <CardTitle className="text-xl flex-1">{event.title}</CardTitle>
                                  {event.featured && (
                                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 ml-2">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatTime(event.startDate)}
                                    {event.endDate && ` - ${formatTime(event.endDate)}`}
                                  </div>
                                  {event.virtual ? (
                                    <div className="flex items-center gap-1">
                                      <Video className="h-4 w-4" />
                                      Virtual Event
                                    </div>
                                  ) : event.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {event.location}
                                    </div>
                                  )}
                                  {event.organizer && (
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {event.organizer}
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {event.type && (
                                    <Badge variant="secondary">{event.type}</Badge>
                                  )}
                                  {event.category && (
                                    <Badge variant="outline">{event.category}</Badge>
                                  )}
                                  {event.capacity && (
                                    <Badge variant="outline">{event.capacity} spots</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          {event.description && (
                            <CardContent>
                              <CardDescription className="line-clamp-2">
                                {event.description}
                              </CardDescription>
                            </CardContent>
                          )}
                        </Card>
                      </a>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="mt-8">
            {opportunitiesLoading ? (
              <div className="text-center py-12">Loading opportunities...</div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No opportunities found matching your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/opportunities/${opportunity.slug}`}>
                      <a>
                        <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl flex-1">{opportunity.title}</CardTitle>
                              {opportunity.featured && (
                                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 ml-2">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {opportunity.type && (
                                <Badge variant="secondary">{opportunity.type}</Badge>
                              )}
                              {opportunity.amount && (
                                <Badge variant="outline" className="text-green-600">
                                  {opportunity.currency || "USD"} {opportunity.amount}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-3 mb-4">
                              {opportunity.description || "No description available"}
                            </CardDescription>
                            
                            <div className="space-y-2 text-sm">
                              {opportunity.provider && (
                                <div className="text-muted-foreground">
                                  <span className="font-medium">Provider:</span> {opportunity.provider}
                                </div>
                              )}
                              {opportunity.deadline && (
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className="font-medium">Deadline:</span> {formatDate(opportunity.deadline)}
                                </div>
                              )}
                            </div>

                            {opportunity.tags && opportunity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {opportunity.tags.slice(0, 4).map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {opportunity.tags.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{opportunity.tags.length - 4}
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
