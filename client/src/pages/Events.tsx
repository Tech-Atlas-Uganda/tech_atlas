import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Calendar as CalendarIcon, DollarSign, MapPin, Clock, Search, Plus, Video, Users, Award, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("upcoming");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = trpc.events.list.useQuery({ status: "approved" });
  const { data: opportunities, isLoading: opportunitiesLoading, refetch: refetchOpportunities } = trpc.opportunities.list.useQuery({ status: "approved" });

  // Refetch data when component mounts
  useEffect(() => {
    refetchEvents();
    refetchOpportunities();
  }, []);

  // Combine events and opportunities into one list
  const allItems = [
    ...(events || []).map(event => ({ ...event, itemType: "event" })),
    ...(opportunities || []).map(opportunity => ({ ...opportunity, itemType: "opportunity" }))
  ];

  const filterItems = (items: any[]) => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organizer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by tab (item type)
    if (activeTab !== "all") {
      filtered = filtered.filter(item => item.itemType === activeTab);
    }

    // Filter by event type (only for events)
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter(item => 
        item.itemType !== "event" || item.type === eventTypeFilter
      );
    }

    // Filter by opportunity type (only for opportunities)
    if (opportunityTypeFilter !== "all") {
      filtered = filtered.filter(item => 
        item.itemType !== "opportunity" || item.type === opportunityTypeFilter
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => 
        item.category === categoryFilter
      );
    }

    // Filter by location
    if (locationFilter === "virtual") {
      filtered = filtered.filter(item => item.virtual === true);
    } else if (locationFilter !== "all") {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter === "upcoming") {
      filtered = filtered.filter(item => {
        if (item.itemType === "event") {
          return item.startDate && new Date(item.startDate) > new Date();
        } else {
          return !item.deadline || new Date(item.deadline) > new Date();
        }
      });
    } else if (statusFilter === "past") {
      filtered = filtered.filter(item => {
        if (item.itemType === "event") {
          return item.startDate && new Date(item.startDate) <= new Date();
        } else {
          return item.deadline && new Date(item.deadline) <= new Date();
        }
      });
    }

    return filtered;
  };

  const filteredItems = filterItems(allItems);
  const filteredEvents = filteredItems.filter(item => item.itemType === "event");
  const filteredOpportunities = filteredItems.filter(item => item.itemType === "opportunity");

  // Get unique values for filters
  const uniqueLocations = Array.from(new Set(
    allItems
      .map(item => item.location)
      .filter((loc): loc is string => Boolean(loc))
      .map(loc => loc.toLowerCase())
  )).sort();

  const uniqueEventTypes = Array.from(new Set(
    (events || []).map(event => event.type).filter(Boolean)
  )).sort();

  const uniqueOpportunityTypes = Array.from(new Set(
    (opportunities || []).map(opportunity => opportunity.type).filter(Boolean)
  )).sort();

  const uniqueCategories = Array.from(new Set(
    allItems.map(item => item.category).filter(Boolean)
  )).sort();

  // Clear filters function
  const clearAllFilters = () => {
    setSearchQuery("");
    setEventTypeFilter("all");
    setOpportunityTypeFilter("all");
    setCategoryFilter("all");
    setLocationFilter("all");
    setStatusFilter("upcoming");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || eventTypeFilter !== "all" || opportunityTypeFilter !== "all" || 
    categoryFilter !== "all" || locationFilter !== "all" || statusFilter !== "upcoming";

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

  const isExpired = (date?: string | Date) => {
    if (!date) return false;
    return new Date(date) <= new Date();
  };

  const formatDeadline = (deadline?: string | Date) => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `${diffDays} days left`;
    return formatDate(deadline);
  };

  // Item Detail Modal Component
  const ItemDetailModal = ({ item, onClose }: { item: any; onClose: () => void }) => (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{item?.title}</DialogTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  variant="outline" 
                  className={item?.itemType === 'event' ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}
                >
                  {item?.itemType === 'event' ? 'Event' : 'Opportunity'}
                </Badge>
                {item?.type && <Badge variant="secondary">{item.type}</Badge>}
                {item?.category && <Badge variant="outline">{item.category}</Badge>}
                {item?.featured && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {item?.imageUrl && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item?.itemType === 'event' ? (
              <>
                {item.startDate && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Date & Time</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(item.startDate)} at {formatTime(item.startDate)}
                        {item.endDate && ` - ${formatTime(item.endDate)}`}
                      </div>
                    </div>
                  </div>
                )}
                {item.virtual ? (
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Format</div>
                      <div className="text-sm text-muted-foreground">Virtual Event</div>
                    </div>
                  </div>
                ) : item.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">{item.location}</div>
                    </div>
                  </div>
                )}
                {item.organizer && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Organizer</div>
                      <div className="text-sm text-muted-foreground">{item.organizer}</div>
                    </div>
                  </div>
                )}
                {item.capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Capacity</div>
                      <div className="text-sm text-muted-foreground">{item.capacity} attendees</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {item.provider && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Provider</div>
                      <div className="text-sm text-muted-foreground">{item.provider}</div>
                    </div>
                  </div>
                )}
                {item.deadline && (
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${isExpired(item.deadline) ? 'text-red-500' : 'text-orange-500'}`} />
                    <div>
                      <div className="font-medium">Deadline</div>
                      <div className={`text-sm ${isExpired(item.deadline) ? 'text-red-500' : 'text-orange-500'}`}>
                        {formatDeadline(item.deadline)}
                      </div>
                    </div>
                  </div>
                )}
                {item.amount && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Value</div>
                      <div className="text-sm text-green-600">
                        {item.currency || "USD"} {item.amount}
                      </div>
                    </div>
                  </div>
                )}
                {item.eligibility && (
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Eligibility</div>
                      <div className="text-sm text-muted-foreground">{item.eligibility}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Description */}
          {item?.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{item.description}</p>
            </div>
          )}

          {/* Tags */}
          {item?.tags && item.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {item?.itemType === 'event' ? (
              <>
                {item.registrationUrl && (
                  <Button asChild className="flex-1">
                    <a href={item.registrationUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Register Now
                    </a>
                  </Button>
                )}
                {item.meetingUrl && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={item.meetingUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Join Event
                    </a>
                  </Button>
                )}
              </>
            ) : (
              <>
                {item.applicationUrl && (
                  <Button asChild className="flex-1">
                    <a href={item.applicationUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
                Events & Opportunities
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover meetups, hackathons, grants, and fellowships
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  refetchEvents();
                  refetchOpportunities();
                }}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4" />
                    Add Event/Opportunity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Submission Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 py-4">
                    <Button
                      asChild
                      variant="outline"
                      className="justify-start gap-3 h-auto p-4"
                    >
                      <Link href="/submit/event?type=event">
                        <a className="flex items-center gap-3 w-full">
                          <CalendarIcon className="h-5 w-5 text-blue-500" />
                          <div className="text-left">
                            <div className="font-medium">Event</div>
                            <div className="text-sm text-muted-foreground">Meetups, conferences, workshops, hackathons</div>
                          </div>
                        </a>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="justify-start gap-3 h-auto p-4"
                    >
                      <Link href="/submit/event?type=opportunity">
                        <a className="flex items-center gap-3 w-full">
                          <Award className="h-5 w-5 text-green-500" />
                          <div className="text-left">
                            <div className="font-medium">Opportunity</div>
                            <div className="text-sm text-muted-foreground">Grants, fellowships, competitions, scholarships</div>
                          </div>
                        </a>
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Search and Clear Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events and opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Main Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Event Type Filter - Only show when on events tab or all tab */}
              {(activeTab === "all" || activeTab === "event") && (
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Event Types</SelectItem>
                    {uniqueEventTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Opportunity Type Filter - Only show when on opportunities tab or all tab */}
              {(activeTab === "all" || activeTab === "opportunity") && (
                <Select value={opportunityTypeFilter} onValueChange={setOpportunityTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Opportunity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Opportunity Types</SelectItem>
                    {uniqueOpportunityTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location.charAt(0).toUpperCase() + location.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-muted-foreground">
              Showing {filteredItems.length} of {allItems.length} items
              {hasActiveFilters && " (filtered)"}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              All ({filteredItems.length})
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Events ({filteredEvents.length})
            </TabsTrigger>
            <TabsTrigger value="opportunity" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Opportunities ({filteredOpportunities.length})
            </TabsTrigger>
          </TabsList>

          {/* All Items Tab */}
          <TabsContent value="all" className="mt-8">
            {(eventsLoading || opportunitiesLoading) ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No items found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={`${item.itemType}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card 
                      className={`h-full cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 ${
                        item.itemType === 'event' 
                          ? (item.startDate && isExpired(item.startDate) ? 'opacity-60' : 'border-l-4 border-l-blue-500')
                          : (item.deadline && isExpired(item.deadline) ? 'opacity-60' : 'border-l-4 border-l-green-500')
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      {/* Image */}
                      {item.imageUrl && (
                        <div className="w-full h-32 overflow-hidden rounded-t-lg">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2 mb-1">{item.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={item.itemType === 'event' ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}
                              >
                                {item.itemType === 'event' ? 'Event' : 'Opportunity'}
                              </Badge>
                              {item.featured && (
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-muted-foreground mb-3">
                          {item.itemType === 'event' ? (
                            <>
                              {item.startDate && (
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {formatDate(item.startDate)}
                                </div>
                              )}
                              {item.virtual ? (
                                <div className="flex items-center gap-1">
                                  <Video className="h-3 w-3" />
                                  Virtual Event
                                </div>
                              ) : item.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {item.location}
                                </div>
                              )}
                              {item.organizer && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {item.organizer}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {item.provider && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {item.provider}
                                </div>
                              )}
                              {item.deadline && (
                                <div className={`flex items-center gap-1 ${isExpired(item.deadline) ? 'text-red-500' : 'text-orange-500'}`}>
                                  <Clock className="h-3 w-3" />
                                  {formatDeadline(item.deadline)}
                                </div>
                              )}
                              {item.amount && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="h-3 w-3" />
                                  {item.currency || "USD"} {item.amount}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {item.description && (
                          <CardDescription className="line-clamp-2 mb-3">
                            {item.description}
                          </CardDescription>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {item.type && (
                            <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                          )}
                          {item.category && (
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="event" className="mt-8">
            {eventsLoading ? (
              <div className="text-center py-12">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card 
                      className={`h-full cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 border-l-4 border-l-blue-500 ${
                        event.startDate && isExpired(event.startDate) ? 'opacity-60' : ''
                      }`}
                      onClick={() => setSelectedItem(event)}
                    >
                      {/* Image */}
                      {event.imageUrl && (
                        <div className="w-full h-32 overflow-hidden rounded-t-lg">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg line-clamp-2 flex-1">{event.title}</CardTitle>
                          {event.featured && (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 ml-2 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-muted-foreground mb-3">
                          {event.startDate && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {formatDate(event.startDate)} at {formatTime(event.startDate)}
                            </div>
                          )}
                          {event.virtual ? (
                            <div className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Virtual Event
                            </div>
                          ) : event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.organizer}
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <CardDescription className="line-clamp-2 mb-3">
                            {event.description}
                          </CardDescription>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {event.type && (
                            <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                          )}
                          {event.category && (
                            <Badge variant="outline" className="text-xs">{event.category}</Badge>
                          )}
                          {event.capacity && (
                            <Badge variant="outline" className="text-xs">{event.capacity} spots</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunity" className="mt-8">
            {opportunitiesLoading ? (
              <div className="text-center py-12">Loading opportunities...</div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No opportunities found matching your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card 
                      className={`h-full cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 border-l-4 border-l-green-500 ${
                        opportunity.deadline && isExpired(opportunity.deadline) ? 'opacity-60' : ''
                      }`}
                      onClick={() => setSelectedItem(opportunity)}
                    >
                      {/* Image */}
                      {opportunity.imageUrl && (
                        <div className="w-full h-32 overflow-hidden rounded-t-lg">
                          <img 
                            src={opportunity.imageUrl} 
                            alt={opportunity.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2 mb-1">{opportunity.title}</CardTitle>
                            {opportunity.deadline && isExpired(opportunity.deadline) && (
                              <Badge variant="destructive" className="text-xs">Expired</Badge>
                            )}
                          </div>
                          {opportunity.featured && (
                            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 ml-2 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-muted-foreground mb-3">
                          {opportunity.provider && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {opportunity.provider}
                            </div>
                          )}
                          {opportunity.deadline && (
                            <div className={`flex items-center gap-1 ${isExpired(opportunity.deadline) ? 'text-red-500' : 'text-orange-500'}`}>
                              <Clock className="h-3 w-3" />
                              {formatDeadline(opportunity.deadline)}
                            </div>
                          )}
                          {opportunity.amount && (
                            <div className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-3 w-3" />
                              {opportunity.currency || "USD"} {opportunity.amount}
                            </div>
                          )}
                        </div>

                        {opportunity.description && (
                          <CardDescription className="line-clamp-2 mb-3">
                            {opportunity.description}
                          </CardDescription>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {opportunity.type && (
                            <Badge variant="secondary" className="text-xs">{opportunity.type}</Badge>
                          )}
                          {opportunity.category && (
                            <Badge variant="outline" className="text-xs">{opportunity.category}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <ItemDetailModal 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}