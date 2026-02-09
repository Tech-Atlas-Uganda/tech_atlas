import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Briefcase, DollarSign, MapPin, Clock, Search, Plus, Building, Calendar, ExternalLink, Mail, Globe, Users, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIJobsAgent } from "@/components/AIJobsAgent";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

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

    return filtered;
  };

  const filteredOpportunities = filterOpportunities(allOpportunities);
  const filteredJobs = filterOpportunities(jobs || []).map(job => ({ ...job, opportunityType: "job" }));
  const filteredGigs = filterOpportunities(gigs || []).map(gig => ({ ...gig, opportunityType: "gig" }));

  const formatSalary = (min?: number, max?: number, curr?: string) => {
    const currency = curr || "UGX";
    if (max && min) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
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

  const CompactOpportunityCard = ({ opportunity, index }: { opportunity: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={() => setSelectedOpportunity(opportunity)}
    >
      <Card className={`h-full hover:shadow-md transition-all duration-200 hover:border-primary/30 ${isExpired(opportunity.expiresAt) ? 'opacity-60' : ''} border-l-4 ${opportunity.opportunityType === 'job' ? 'border-l-blue-500' : 'border-l-green-500'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base leading-tight truncate">{opportunity.title}</h3>
                {isExpired(opportunity.expiresAt) && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Expired</Badge>
                )}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                {opportunity.opportunityType === 'job' ? (
                  <>
                    <Building className="h-3.5 w-3.5 mr-1.5" />
                    <span className="truncate">{opportunity.company}</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                    <span>Freelance Project</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0.5 ${opportunity.opportunityType === 'job' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-green-200 text-green-700 bg-green-50'}`}
                >
                  {opportunity.opportunityType === 'job' ? 'Job' : 'Gig'}
                </Badge>
                
                {(opportunity.type || opportunity.category) && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {opportunity.type || opportunity.category}
                  </Badge>
                )}
                
                {opportunity.remote ? (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Remote
                  </Badge>
                ) : opportunity.location && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {opportunity.location}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold text-primary">
                {opportunity.opportunityType === 'job' 
                  ? formatSalary(opportunity.salaryMin, opportunity.salaryMax, opportunity.currency)
                  : opportunity.budget 
                    ? `${opportunity.currency || "UGX"} ${opportunity.budget.toLocaleString()}`
                    : "Budget TBD"
                }
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {new Date(opportunity.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>
        
        {opportunity.description && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {opportunity.description}
            </p>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );

  const OpportunityDetailModal = ({ opportunity, onClose }: { opportunity: any; onClose: () => void }) => (
    <Dialog open={!!opportunity} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{opportunity.title}</DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                {opportunity.opportunityType === 'job' ? (
                  <>
                    <Building className="h-4 w-4" />
                    <span className="font-medium">{opportunity.company}</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Freelance Project</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary mb-1">
                {opportunity.opportunityType === 'job' 
                  ? formatSalary(opportunity.salaryMin, opportunity.salaryMax, opportunity.currency)
                  : opportunity.budget 
                    ? `${opportunity.currency || "UGX"} ${opportunity.budget.toLocaleString()}`
                    : "Budget TBD"
                }
              </div>
              <Badge 
                variant="outline" 
                className={opportunity.opportunityType === 'job' ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}
              >
                {opportunity.opportunityType === 'job' ? 'Job Opening' : 'Gig Project'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {opportunity.remote ? 'Remote' : opportunity.location || 'Location not specified'}
                </span>
              </div>
              
              {(opportunity.type || opportunity.category) && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{opportunity.type || opportunity.category}</span>
                </div>
              )}
              
              {opportunity.experienceLevel && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{opportunity.experienceLevel}</span>
                </div>
              )}
              
              {opportunity.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{opportunity.duration}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Posted {new Date(opportunity.createdAt).toLocaleDateString()}</span>
              </div>
              
              {opportunity.expiresAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${isExpired(opportunity.expiresAt) ? 'text-red-500' : 'text-orange-500'}`}>
                    {formatExpiryDate(opportunity.expiresAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {opportunity.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {opportunity.requirements && (
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {opportunity.requirements}
              </p>
            </div>
          )}

          {/* Responsibilities (Jobs only) */}
          {opportunity.responsibilities && (
            <div>
              <h4 className="font-semibold mb-2">Responsibilities</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {opportunity.responsibilities}
              </p>
            </div>
          )}

          {/* Contact/Application */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">How to Apply</h4>
            <div className="flex flex-wrap gap-3">
              {opportunity.applicationUrl && (
                <Button asChild>
                  <a href={opportunity.applicationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Online
                  </a>
                </Button>
              )}
              
              {opportunity.applicationEmail && (
                <Button variant="outline" asChild>
                  <a href={`mailto:${opportunity.applicationEmail}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Application
                  </a>
                </Button>
              )}
              
              {opportunity.contactEmail && !opportunity.applicationEmail && (
                <Button variant="outline" asChild>
                  <a href={`mailto:${opportunity.contactEmail}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-8"
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
                    Post Job
                  </a>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/submit/gig">
                  <a className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Post Gig
                  </a>
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* AI Jobs Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <AIJobsAgent />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg mb-6">
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
          <TabsContent value="all">
            {(jobsLoading || gigsLoading) ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading opportunities...</p>
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No opportunities found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOpportunities.map((opportunity, index) => (
                  <CompactOpportunityCard 
                    key={`${opportunity.opportunityType}-${opportunity.id}`}
                    opportunity={opportunity} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="job">
            {jobsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No jobs found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job, index) => (
                  <CompactOpportunityCard 
                    key={job.id}
                    opportunity={job} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gig">
            {gigsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading gigs...</p>
              </div>
            ) : filteredGigs.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No gigs found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGigs.map((gig, index) => (
                  <CompactOpportunityCard 
                    key={gig.id}
                    opportunity={gig} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedOpportunity && (
            <OpportunityDetailModal 
              opportunity={selectedOpportunity} 
              onClose={() => setSelectedOpportunity(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}