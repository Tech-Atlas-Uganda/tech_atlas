import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Briefcase, DollarSign, MapPin, Clock, Search, Plus, Building } from "lucide-react";
import { motion } from "framer-motion";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");                                                                                                                                                                                                                                                                                                                  
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [remoteFilter, setRemoteFilter] = useState<string>("all");

  const { data: jobs, isLoading: jobsLoading } = trpc.jobs.list.useQuery({ status: "approved" });
  const { data: gigs, isLoading: gigsLoading } = trpc.gigs.list.useQuery({ status: "approved" });

  const filterJobs = (items: any[] | undefined) => {
    if (!items) return [];
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (jobTypeFilter !== "all") {
      filtered = filtered.filter(item => item.type === jobTypeFilter);
    }

    if (remoteFilter === "remote") {
      filtered = filtered.filter(item => item.remote === true);
    } else if (remoteFilter === "onsite") {
      filtered = filtered.filter(item => item.remote === false);
    }

    return filtered;
  };

  const filterGigs = (items: any[] | undefined) => {
    if (!items) return [];
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredJobs = filterJobs(jobs);
  const filteredGigs = filterGigs(gigs);

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    const curr = currency || "UGX";
    if (min && max) return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}+`;
    return "Competitive";
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
            <Button asChild>
              <Link href="/submit/job">
                <a className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Post Opportunity
                </a>
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, gigs, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "jobs" && (
              <>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={remoteFilter} onValueChange={setRemoteFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs ({filteredJobs.length})
            </TabsTrigger>
            <TabsTrigger value="gigs" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Gigs ({filteredGigs.length})
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="mt-8">
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
                        <Card className="hover:shadow-lg transition-all hover:border-primary/50">
                          <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="flex-1">
                                    <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
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
          <TabsContent value="gigs" className="mt-8">
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
                        <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl flex-1">{gig.title}</CardTitle>
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
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-semibold text-primary">
                                {gig.budget ? `${gig.currency || "UGX"} ${gig.budget.toLocaleString()}` : "Budget TBD"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(gig.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {gig.skills && gig.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
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
