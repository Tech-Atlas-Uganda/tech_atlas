import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Briefcase, DollarSign, MapPin, Clock, Search, Plus, Building, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");                                                                                                                                                                                                                                                                                                                  
  const [activeTab, setActiveTab] = useState("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const { data: jobs, isLoading: jobsLoading } = trpc.jobs.list.useQuery({ status: "approved" });
  const { data: gigs, isLoading: gigsLoading } = trpc.gigs.list.useQuery({ status: "approved" });

  // Combine jobs and gigs into one list
  const allOpportunities = [
    ...(jobs || []).map(job => ({ ...job, opportunityType: "job" })),
    ...(gigs || []).map(gig => ({ ...gig, opportunityType: "gig" }))
  ];

  const filterOpportunities = (items: any[]) => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab (opportunity type)
    if (activeTab !== "all") {
      filtered = filtered.filter(item => item.opportunityType === activeTab);
    }

    // Filter by type (job type or gig category)
    if (typeFilter !== "all") {
      filtered = filtered.filter(item => 
        (item as any).type === typeFilter || (item as any).category === typeFilter
      );
    }

    // Filter by location
    if (locationFilter === "remote") {
      filtered = filtered.filter(item => item.remote === true);
    } else if (locationFilter !== "all") {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by status (active/expired)
    if (statusFilter === "active") {
      filtered = filtered.filter(item => {
        if (!item.expiresAt) return true; // No expiry date means active
        return new Date(item.expiresAt) > new Date();
      });
    } else if (statusFilter === "expired") {
      filtered = filtered.filter(item => {
        if (!item.expiresAt) return false;
        return new Date(item.expiresAt) <= new Date();
      });
    }

    return filtered;
  };

  const filteredOpportunities = filterOpportunities(allOpportunities);
  const filteredJobs = filteredOpportunities.filter(item => item.opportunityType === "job");
  const filteredGigs = filteredOpportunities.filter(item => item.opportunityType === "gig");

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(
    allOpportunities
      .map(item => item.location)
      .filter((loc): loc is string => Boolean(loc))
      .map(loc => loc.toLowerCase())
  )).sort();

  // Get unique types for filter
  const uniqueTypes = Array.from(new Set([
    ...allOpportunities.map(item => (item as any).type).filter(Boolean),
    ...allOpportunities.map(item => (item as any).category).filter(Boolean)
  ])).sort();

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    const curr = currency || "UGX";
    if (min && max) return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}+`;
    return "Competitive";
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  };

  const formatExpiryDate = (expiresAt?: string) => {
    if (!expiresAt) return "No expiry";
    const date = new Date(expiresAt);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires tomorrow";
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    return date.toLocaleDateString();
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
                Jobs & Gigs
              </h1>
              <p className="text-lg text-muted-foreground">
                Find opportunities across Uganda's tech ecosystem
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/submit/job">
                  <a className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Post Opportunity
                  </a>
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location.charAt(0).toUpperCase() + location.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              All ({filteredOpportunities.length})
            </TabsTrigger>
            <TabsTrigger value="job" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs ({filteredJobs.length})
            </TabsTrigger>
            <TabsTrigger value="gig" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Gigs ({filteredGigs.length})
            </TabsTrigger>
          </TabsList>

          {/* All Opportunities Tab */}
          <TabsContent value="all" className="mt-8">
            {(jobsLoading || gigsLoading) ? (
              <div className="text-center py-12">Loading opportunities...</div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No opportunities found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={`${opportunity.opportunityType}-${opportunity.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/${opportunity.opportunityType === 'job' ? 'jobs' : 'gigs'}/${opportunity.slug}`}>
                      <a>
                        <Card className={`hover:shadow-lg transition-all hover:border-primary/50 ${isExpired(opportunity.expiresAt) ? 'opacity-60' : ''}`}>
                          <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                                      {isExpired(opportunity.expiresAt) && (
                                        <Badge variant="destructive" className="text-xs">Expired</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                      {opportunity.opportunityType === 'job' ? (
                                        <>
                                          <Building className="h-4 w-4 mr-1" />
                                          <span className="font-medium">{opportunity.company}</span>
                                        </>
                                      ) : (
                                        <>
                                          <DollarSign className="h-4 w-4 mr-1" />
                                          <span className="font-medium">Gig Project</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={opportunity.opportunityType === 'job' ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}
                                  >
                                    {opportunity.opportunityType === 'job' ? 'Job' : 'Gig'}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {opportunity.type && <Badge variant="secondary">{opportunity.type}</Badge>}
                                  {opportunity.category && <Badge variant="secondary">{opportunity.category}</Badge>}
                                  {opportunity.remote ? (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      Remote
                                    </Badge>
                                  ) : opportunity.location && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {opportunity.location}
                                    </Badge>
                                  )}
                                  {opportunity.duration && (
                                    <Badge variant="outline">{opportunity.duration}</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-primary">
                                  {opportunity.opportunityType === 'job' 
                                    ? formatSalary(opportunity.salaryMin, opportunity.salaryMax, opportunity.currency)
                                    : opportunity.budget 
                                      ? `${opportunity.currency || "UGX"} ${opportunity.budget.toLocaleString()}`
                                      : "Budget TBD"
                                  }
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center justify-end gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(opportunity.createdAt).toLocaleDateString()}
                                </div>
                                {opportunity.expiresAt && (
                                  <div className={`text-xs flex items-center justify-end gap-1 mt-1 ${isExpired(opportunity.expiresAt) ? 'text-red-500' : 'text-orange-500'}`}>
                                    <Calendar className="h-3 w-3" />
                                    {formatExpiryDate(opportunity.expiresAt)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          {opportunity.description && (
                            <CardContent>
                              <CardDescription className="line-clamp-2">
                                {opportunity.description}
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

          {/* Jobs Tab */}
          <TabsContent value="job" className="mt-8">
            {jobsLoading ? (
              <div className="text-center py-12">Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No jobs found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/jobs/${job.slug}`}>
                      <a>
                        <Card className={`hover:shadow-lg transition-all hover:border-primary/50 ${isExpired(job.expiresAt) ? 'opacity-60' : ''}`}>
                          <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <CardTitle className="text-xl">{job.title}</CardTitle>
                                      {isExpired(job.expiresAt) && (
                                        <Badge variant="destructive" className="text-xs">Expired</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                      <Building className="h-4 w-4 mr-1" />
                                      <span className="font-medium">{job.company}</span>
                                    </div>
                                  </div>
                                  {job.featured && (
                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <Badge variant="secondary">{job.type}</Badge>
                                  {job.remote ? (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      Remote
                                    </Badge>
                                  ) : job.location && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {job.location}
                                    </Badge>
                                  )}
                                  {job.experienceLevel && (
                                    <Badge variant="outline">{job.experienceLevel}</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-primary">
                                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center justify-end gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                                {job.expiresAt && (
                                  <div className={`text-xs flex items-center justify-end gap-1 mt-1 ${isExpired(job.expiresAt) ? 'text-red-500' : 'text-orange-500'}`}>
                                    <Calendar className="h-3 w-3" />
                                    {formatExpiryDate(job.expiresAt)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          {job.description && (
                            <CardContent>
                              <CardDescription className="line-clamp-2">
                                {job.description}
                              </CardDescription>
                              {job.skills && job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {job.skills.slice(0, 5).map((skill: string) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {job.skills.length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{job.skills.length - 5} more
                                    </Badge>
                                  )}
                                </div>
                              )}
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

          {/* Gigs Tab */}
          <TabsContent value="gig" className="mt-8">
            {gigsLoading ? (
              <div className="text-center py-12">Loading gigs...</div>
            ) : filteredGigs.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No gigs found matching your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredGigs.map((gig, index) => (
                  <motion.div
                    key={gig.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/gigs/${gig.slug}`}>
                      <a>
                        <Card className={`h-full hover:shadow-lg transition-all hover:border-primary/50 ${isExpired(gig.expiresAt) ? 'opacity-60' : ''}`}>
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CardTitle className="text-xl">{gig.title}</CardTitle>
                                  {isExpired(gig.expiresAt) && (
                                    <Badge variant="destructive" className="text-xs">Expired</Badge>
                                  )}
                                </div>
                              </div>
                              {gig.featured && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 ml-2">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {gig.category && (
                                <Badge variant="secondary">{gig.category}</Badge>
                              )}
                              {gig.remote && (
                                <Badge variant="outline">Remote</Badge>
                              )}
                              {gig.duration && (
                                <Badge variant="outline">{gig.duration}</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-3 mb-4">
                              {gig.description || "No description available"}
                            </CardDescription>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-lg font-semibold text-primary">
                                {gig.budget ? `${gig.currency || "UGX"} ${gig.budget.toLocaleString()}` : "Budget TBD"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(gig.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {gig.expiresAt && (
                              <div className={`text-xs flex items-center gap-1 mb-3 ${isExpired(gig.expiresAt) ? 'text-red-500' : 'text-orange-500'}`}>
                                <Calendar className="h-3 w-3" />
                                {formatExpiryDate(gig.expiresAt)}
                              </div>
                            )}
                            {gig.skills && gig.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {gig.skills.slice(0, 4).map((skill: string) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {gig.skills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{gig.skills.length - 4}
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
