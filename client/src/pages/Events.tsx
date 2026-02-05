import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Calendar as CalendarIcon, DollarSign, MapPin, Clock, Search, Plus, Video, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("upcoming");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [organizerFilter, setOrganizerFilter] = useState<string>("all");

  const { data: events, isLoading: eventsLoading } = trpc.events.list.useQuery({ status: "approved" });
  const { data: opportunities, isLoading: opportunitiesLoading } = trpc.opportunities.list.useQuery({ status: "approved" });

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

    // Filter by organizer/provider
    if (organizerFilter !== "all") {
      filtered = filtered.filter(item => 
        (item.organizer && item.organizer.toLowerCase().includes(organizerFilter.toLowerCase())) ||
        (item.provider && item.provider.toLowerCase().includes(organizerFilter.toLowerCase()))
      );
    }

    // Filter by date range
    if (dateRangeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(item => {
        const itemDate = item.itemType === "event" 
          ? (item.startDate ? new Date(item.startDate) : null)
          : (item.deadline ? new Date(item.deadline) : null);
        
        if (!itemDate) return false;

        switch (dateRangeFilter) {
          case "today":
            return itemDate >= today && itemDate < tomorrow;
          case "tomorrow":
            return itemDate >= tomorrow && itemDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          case "this-week":
            return itemDate >= today && itemDate < nextWeek;
          case "this-month":
            return itemDate >= today && itemDate < nextMonth;
          default:
            return true;
        }
      });
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

  const uniqueOrganizers = Array.from(new Set([
    ...(events || []).map(event => event.organizer).filter(Boolean),
    ...(opportunities || []).map(opportunity => opportunity.provider).filter(Boolean)
  ])).sort();

  // Clear filters function
  const clearAllFilters = () => {
    setSearchQuery("");
    setEventTypeFilter("all");
    setOpportunityTypeFilter("all");
    setCategoryFilter("all");
    setLocationFilter("all");
    setStatusFilter("upcoming");
    setDateRangeFilter("all");
    setOrganizerFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || eventTypeFilter !== "all" || opportunityTypeFilter !== "all" || 
    categoryFilter !== "all" || locationFilter !== "all" || statusFilter !== "upcoming" || 
    dateRangeFilter !== "all" || organizerFilter !== "all";

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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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

              {/* Date Range Filter */}
              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Secondary Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Organizer/Provider Filter */}
              <Select value={organizerFilter} onValueChange={setOrganizerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Organizer/Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizers</SelectItem>
                  {uniqueOrganizers.map(organizer => (
                    <SelectItem key={organizer} value={organizer}>{organizer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center text-sm text-muted-foreground">
                Showing {filteredItems.length} of {allItems.length} items
                {hasActiveFilters && " (filtered)"}
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {eventTypeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Event: {eventTypeFilter}
                    <button onClick={() => setEventTypeFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {opportunityTypeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Opportunity: {opportunityTypeFilter}
                    <button onClick={() => setOpportunityTypeFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {locationFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Location: {locationFilter === "virtual" ? "Virtual" : locationFilter.charAt(0).toUpperCase() + locationFilter.slice(1)}
                    <button onClick={() => setLocationFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== "upcoming" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter("upcoming")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {dateRangeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {dateRangeFilter.replace("-", " ")}
                    <button onClick={() => setDateRangeFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {organizerFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Organizer: {organizerFilter}
                    <button onClick={() => setOrganizerFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
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
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={`${item.itemType}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/${item.itemType === 'event' ? 'events' : 'opportunities'}/${item.slug}`}>
                      <a>
                        <Card className={`hover:shadow-lg transition-all hover:border-primary/50 ${
                          item.itemType === 'event' 
                            ? (item.startDate && isExpired(item.startDate) ? 'opacity-60' : '')
                            : (item.deadline && isExpired(item.deadline) ? 'opacity-60' : '')
                        }`}>
                          <CardHeader>
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Image or Date/Status Box */}
                              {item.imageUrl ? (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : item.itemType === 'event' ? (
                                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex flex-col items-center justify-center text-white">
                                  <div className="text-2xl font-bold">
                                    {item.startDate ? new Date(item.startDate).getDate() : '?'}
                                  </div>
                                  <div className="text-xs uppercase">
                                    {item.startDate ? new Date(item.startDate).toLocaleDateString("en-US", { month: "short" }) : 'TBD'}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex flex-col items-center justify-center text-white">
                                  <Award className="h-8 w-8" />
                                </div>
                              )}

                              {/* Item Details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <CardTitle className="text-xl">{item.title}</CardTitle>
                                      <Badge 
                                        variant="outline" 
                                        className={item.itemType === 'event' ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}
                                      >
                                        {item.itemType === 'event' ? 'Event' : 'Opportunity'}
                                      </Badge>
                                    </div>
                                  </div>
                                  {item.featured && (
                                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 ml-2">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                  {item.itemType === 'event' ? (
                                    <>
                                      {item.startDate && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          {formatTime(item.startDate)}
                                          {item.endDate && ` - ${formatTime(item.endDate)}`}
                                        </div>
                                      )}
                                      {item.virtual ? (
                                        <div className="flex items-center gap-1">
                                          <Video className="h-4 w-4" />
                                          Virtual Event
                                        </div>
                                      ) : item.location && (
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-4 w-4" />
                                          {item.location}
                                        </div>
                                      )}
                                      {item.organizer && (
                                        <div className="flex items-center gap-1">
                                          <Users className="h-4 w-4" />
                                          {item.organizer}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {item.provider && (
                                        <div className="flex items-center gap-1">
                                          <Users className="h-4 w-4" />
                                          {item.provider}
                                        </div>
                                      )}
                                      {item.deadline && (
                                        <div className={`flex items-center gap-1 ${isExpired(item.deadline) ? 'text-red-500' : 'text-orange-500'}`}>
                                          <Clock className="h-4 w-4" />
                                          {formatDeadline(item.deadline)}
                                        </div>
                                      )}
                                      {item.amount && (
                                        <div className="flex items-center gap-1 text-green-600">
                                          <DollarSign className="h-4 w-4" />
                                          {item.currency || "USD"} {item.amount}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {item.type && (
                                    <Badge variant="secondary">{item.type}</Badge>
                                  )}
                                  {item.category && (
                                    <Badge variant="outline">{item.category}</Badge>
                                  )}
                                  {item.capacity && (
                                    <Badge variant="outline">{item.capacity} spots</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          {item.description && (
                            <CardContent>
                              <CardDescription className="line-clamp-2">
                                {item.description}
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
                        <Card className={`hover:shadow-lg transition-all hover:border-primary/50 ${
                          event.startDate && isExpired(event.startDate) ? 'opacity-60' : ''
                        }`}>
                          <CardHeader>
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Image or Date Box */}
                              {event.imageUrl ? (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                  <img 
                                    src={event.imageUrl} 
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex flex-col items-center justify-center text-white">
                                  <div className="text-2xl font-bold">
                                    {event.startDate ? new Date(event.startDate).getDate() : '?'}
                                  </div>
                                  <div className="text-xs uppercase">
                                    {event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short" }) : 'TBD'}
                                  </div>
                                </div>
                              )}

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
                                  {event.startDate && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {formatTime(event.startDate)}
                                      {event.endDate && ` - ${formatTime(event.endDate)}`}
                                    </div>
                                  )}
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
          <TabsContent value="opportunity" className="mt-8">
            {opportunitiesLoading ? (
              <div className="text-center py-12">Loading opportunities...</div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
                        <Card className={`h-full hover:shadow-lg transition-all hover:border-primary/50 ${
                          opportunity.deadline && isExpired(opportunity.deadline) ? 'opacity-60' : ''
                        }`}>
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
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                                  {opportunity.deadline && isExpired(opportunity.deadline) && (
                                    <Badge variant="destructive" className="text-xs">Expired</Badge>
                                  )}
                                </div>
                              </div>
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
                                <div className={`flex items-center ${isExpired(opportunity.deadline) ? 'text-red-500' : 'text-orange-500'}`}>
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className="font-medium">Deadline:</span> {formatDeadline(opportunity.deadline)}
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
