import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Flag,
  MessageSquare,
  Calendar,
  Briefcase,
  FileText,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";

export default function Moderator() {
  const [activeTab, setActiveTab] = useState("pending");
  
  const { data: pendingContent, isLoading } = trpc.admin.getPendingContent.useQuery();
  const { data: moderationLog } = trpc.admin.getModerationLog.useQuery();
  
  const approveContentMutation = trpc.events.update.useMutation();
  const logModerationMutation = trpc.admin.logModerationAction.useMutation();

  const handleApprove = async (type: string, id: number, reason?: string) => {
    try {
      // This would need to be updated based on content type
      if (type === 'event') {
        await approveContentMutation.mutateAsync({
          id,
          status: 'approved',
        });
      }
      
      await logModerationMutation.mutateAsync({
        action: 'approve',
        targetType: type,
        targetId: id,
        reason,
      });
      
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  const handleReject = async (type: string, id: number, reason?: string) => {
    try {
      // This would need to be updated based on content type
      if (type === 'event') {
        await approveContentMutation.mutateAsync({
          id,
          status: 'rejected',
        });
      }
      
      await logModerationMutation.mutateAsync({
        action: 'reject',
        targetType: type,
        targetId: id,
        reason,
      });
      
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to reject content:', error);
    }
  };

  return (
    <ProtectedRoute requireRole="moderator">
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
              <Shield className="h-8 w-8 text-blue-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk']">
                Moderator Dashboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Content moderation and community management
            </p>
          </motion.div>

          {/* Moderator Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-['Space_Grotesk'] flex items-center gap-2">
                <Flag className="h-6 w-6" />
                Content Moderation
              </CardTitle>
              <CardDescription>
                Review and moderate platform content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Reports
                  </TabsTrigger>
                  <TabsTrigger value="forum" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Forum
                  </TabsTrigger>
                  <TabsTrigger value="log" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Activity Log
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Pending Content</h3>
                      <Badge variant="outline">
                        {pendingContent?.events?.length || 0} Items
                      </Badge>
                    </div>
                    
                    {isLoading ? (
                      <div className="text-center py-8">Loading pending content...</div>
                    ) : (
                      <div className="space-y-4">
                        {/* Events */}
                        {pendingContent?.events?.map((event) => (
                          <Card key={`event-${event.id}`} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                  <Badge variant="outline">Event</Badge>
                                </div>
                                <h4 className="font-semibold mb-1">{event.title}</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {event.description?.substring(0, 150)}...
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Type: {event.type}</span>
                                  <span>Category: {event.category}</span>
                                  <span>Date: {new Date(event.startDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove('event', event.id, 'Approved by moderator')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject('event', event.id, 'Rejected by moderator')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {/* Jobs */}
                        {pendingContent?.jobs?.map((job) => (
                          <Card key={`job-${job.id}`} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Briefcase className="h-4 w-4 text-green-500" />
                                  <Badge variant="outline">Job</Badge>
                                </div>
                                <h4 className="font-semibold mb-1">{job.title}</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {job.company} • {job.location}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Type: {job.type}</span>
                                  <span>Remote: {job.remote ? 'Yes' : 'No'}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove('job', job.id, 'Approved by moderator')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject('job', job.id, 'Rejected by moderator')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {(!pendingContent?.events?.length && !pendingContent?.jobs?.length) && (
                          <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                            <p className="text-muted-foreground">
                              No pending content to review at the moment.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="reports">
                  <div className="text-center py-12">
                    <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">User Reports</h3>
                    <p className="text-muted-foreground mb-4">
                      User reporting system coming soon
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="forum">
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Forum Moderation</h3>
                    <p className="text-muted-foreground mb-4">
                      Forum moderation tools coming soon
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="log">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Moderation Activity Log</h3>
                    <div className="space-y-3">
                      {moderationLog?.map((entry) => (
                        <Card key={entry.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {entry.action.toUpperCase()} {entry.targetType} #{entry.targetId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {entry.reason || 'No reason provided'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(entry.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="outline">
                              Moderator {entry.moderatorId}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}