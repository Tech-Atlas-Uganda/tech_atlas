import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Building2,
  Rocket,
  BookOpen,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: stats } = trpc.admin.getStats.useQuery();
  const { data: pendingContent } = trpc.admin.getPendingContent.useQuery();
  
  const utils = trpc.useUtils();

  // Mutations for different content types
  const updateHub = trpc.hubs.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Hub updated successfully");
    },
  });

  const updateCommunity = trpc.communities.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Community updated successfully");
    },
  });

  const updateStartup = trpc.startups.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Startup updated successfully");
    },
  });

  const updateJob = trpc.jobs.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Job updated successfully");
    },
  });

  const updateGig = trpc.gigs.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Gig updated successfully");
    },
  });

  const updateLearning = trpc.learning.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Learning resource updated successfully");
    },
  });

  const updateEvent = trpc.events.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Event updated successfully");
    },
  });

  const updateOpportunity = trpc.opportunities.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Opportunity updated successfully");
    },
  });

  const updateBlogPost = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.admin.getPendingContent.invalidate();
      utils.admin.getStats.invalidate();
      toast.success("Blog post updated successfully");
    },
  });

  // Check if user is admin or moderator
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return (
      <div className="min-h-screen bg-background">
        
        <div className="container py-20 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      icon: Users, 
      label: "Total Hubs", 
      value: stats?.hubs || 0,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: Briefcase, 
      label: "Active Jobs", 
      value: stats?.jobs || 0,
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Calendar, 
      label: "Upcoming Events", 
      value: stats?.events || 0,
      color: "from-orange-500 to-red-500"
    },
    { 
      icon: FileText, 
      label: "Published Posts", 
      value: stats?.blogPosts || 0,
      color: "from-green-500 to-emerald-500"
    },
  ];

  const renderPendingItem = (item: any, type: string) => {
    const handleApprove = () => {
      const mutations: Record<string, any> = {
        hub: updateHub,
        community: updateCommunity,
        startup: updateStartup,
        job: updateJob,
        gig: updateGig,
        learning: updateLearning,
        event: updateEvent,
        opportunity: updateOpportunity,
        blog: updateBlogPost,
      };
      
      mutations[type]?.mutate({ id: item.id, status: "approved" });
    };

    const handleReject = () => {
      const mutations: Record<string, any> = {
        hub: updateHub,
        community: updateCommunity,
        startup: updateStartup,
        job: updateJob,
        gig: updateGig,
        learning: updateLearning,
        event: updateEvent,
        opportunity: updateOpportunity,
        blog: updateBlogPost,
      };
      
      mutations[type]?.mutate({ id: item.id, status: "rejected" });
    };

    return (
      <Card key={`${type}-${item.id}`} className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{item.title || item.name}</CardTitle>
              <CardDescription className="mt-1">
                {type.charAt(0).toUpperCase() + type.slice(1)} • 
                Submitted {new Date(item.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="outline" className="ml-2">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {item.description || item.excerpt || "No description"}
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleApprove}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={handleReject}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/${type}s/${item.slug}`}>
                <a>View Details</a>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk']">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Moderate content and manage the Tech Atlas platform
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription className="text-sm font-medium">
                      {stat.label}
                    </CardDescription>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Pending Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-['Space_Grotesk']">Pending Approvals</CardTitle>
            <CardDescription>
              Review and moderate submitted content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-9 mb-6">
                <TabsTrigger value="overview">All</TabsTrigger>
                <TabsTrigger value="hubs">Hubs</TabsTrigger>
                <TabsTrigger value="communities">Communities</TabsTrigger>
                <TabsTrigger value="startups">Startups</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="gigs">Gigs</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {!pendingContent || Object.values(pendingContent).every((arr: any) => arr.length === 0) ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending content to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.hubs?.map((item: any) => renderPendingItem(item, "hub"))}
                    {pendingContent.communities?.map((item: any) => renderPendingItem(item, "community"))}
                    {pendingContent.startups?.map((item: any) => renderPendingItem(item, "startup"))}
                    {pendingContent.jobs?.map((item: any) => renderPendingItem(item, "job"))}
                    {pendingContent.gigs?.map((item: any) => renderPendingItem(item, "gig"))}
                    {pendingContent.learningResources?.map((item: any) => renderPendingItem(item, "learning"))}
                    {pendingContent.events?.map((item: any) => renderPendingItem(item, "event"))}
                    {pendingContent.opportunities?.map((item: any) => renderPendingItem(item, "opportunity"))}
                    {pendingContent.blogPosts?.map((item: any) => renderPendingItem(item, "blog"))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hubs">
                {!pendingContent?.hubs || pendingContent.hubs.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending hubs to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.hubs.map((item: any) => renderPendingItem(item, "hub"))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="communities">
                {!pendingContent?.communities || pendingContent.communities.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending communities to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.communities.map((item: any) => renderPendingItem(item, "community"))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="startups">
                {!pendingContent?.startups || pendingContent.startups.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending startups to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.startups.map((item: any) => renderPendingItem(item, "startup"))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="jobs">
                {!pendingContent?.jobs || pendingContent.jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending jobs to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.jobs.map((item: any) => renderPendingItem(item, "job"))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="gigs">
                {!pendingContent?.gigs || pendingContent.gigs.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending gigs to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.gigs.map((item: any) => renderPendingItem(item, "gig"))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="learning">
                {!pendingContent?.learningResources || pendingContent.learningResources.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending learning resources to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.learningResources.map((item: any) => renderPendingItem(item, "learning"))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="events">
                {!pendingContent?.events || pendingContent.events.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending events to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.events.map((item: any) => renderPendingItem(item, "event"))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="blog">
                {!pendingContent?.blogPosts || pendingContent.blogPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No pending blog posts to review</p>
                  </div>
                ) : (
                  <div>
                    {pendingContent.blogPosts.map((item: any) => renderPendingItem(item, "blog"))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
