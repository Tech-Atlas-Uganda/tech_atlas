import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Shield, 
  Users, 
  Settings, 
  Database,
  Activity,
  UserCheck,
  UserX,
  Crown,
  AlertTriangle,
  Trash2,
  Edit,
  Eye,
  BarChart3,
  FileText,
  MessageSquare,
  Calendar,
  Briefcase,
  Search,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function CoreAdmin() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleChangeReason, setRoleChangeReason] = useState("");
  
  // Queries
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.getAllUsers.useQuery();
  const { data: roleHierarchy } = trpc.admin.getRoleHierarchy.useQuery();
  const { data: auditLog, refetch: refetchAuditLog } = trpc.admin.getRoleAuditLog.useQuery();
  const { data: stats } = trpc.stats.getCounts.useQuery();
  
  // Mutations
  const assignRoleMutation = trpc.admin.assignRole.useMutation({
    onSuccess: () => {
      toast.success("Role assigned successfully");
      refetchUsers();
      refetchAuditLog();
      setRoleChangeReason("");
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(`Failed to assign role: ${error.message}`);
    }
  });
  
  const deactivateUserMutation = trpc.admin.deactivateUser.useMutation({
    onSuccess: () => {
      toast.success("User deactivated successfully");
      refetchUsers();
      refetchAuditLog();
    },
    onError: (error) => {
      toast.error(`Failed to deactivate user: ${error.message}`);
    }
  });

  const handleRoleChange = async (userId: number, newRole: string, reason?: string) => {
    try {
      await assignRoleMutation.mutateAsync({
        userId,
        newRole: newRole as any,
        reason: reason || roleChangeReason || "Role updated by Core Admin",
      });
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const handleDeactivateUser = async (userId: number, reason?: string) => {
    try {
      await deactivateUserMutation.mutateAsync({
        userId,
        reason: reason || "Deactivated by Core Admin",
      });
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  // Filter users based on search
  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute requireRole="core_admin">
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
              <Crown className="h-8 w-8 text-yellow-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk']">
                Core Admin
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Ultimate platform control and system management
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{users?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.blogPosts || 0}</p>
                  <p className="text-sm text-muted-foreground">Blog Posts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.forumThreads || 0}</p>
                  <p className="text-sm text-muted-foreground">Forum Threads</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.events || 0}</p>
                  <p className="text-sm text-muted-foreground">Events</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Core Admin Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-['Space_Grotesk'] flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    System Administration
                  </CardTitle>
                  <CardDescription>
                    Complete platform control - manage users, roles, content, and system settings
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchUsers();
                    refetchAuditLog();
                    toast.success("Data refreshed");
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Roles
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Audit Log
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    System
                  </TabsTrigger>
                </TabsList>

                {/* USERS TAB */}
                <TabsContent value="users">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">User Management</h3>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Badge variant="outline">{filteredUsers?.length || 0} Users</Badge>
                      </div>
                    </div>
                    
                    {usersLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading users...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredUsers?.map((user) => (
                          <Card key={user.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium">{user.name || 'Unnamed User'}</p>
                                    {user.id === 1 && (
                                      <Badge variant="outline" className="text-xs">
                                        <Crown className="h-3 w-3 mr-1" />
                                        You
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant={
                                      user.role === 'core_admin' ? 'default' :
                                      user.role === 'admin' ? 'secondary' :
                                      'outline'
                                    }>
                                      {user.role}
                                    </Badge>
                                    {!user.isActive && (
                                      <Badge variant="destructive">Inactive</Badge>
                                    )}
                                    {user.roleAssignedAt && (
                                      <span className="text-xs text-muted-foreground">
                                        Role assigned: {new Date(user.roleAssignedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Role Change Dialog */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={user.id === 1}
                                      onClick={() => setSelectedUser(user)}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Change Role
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Change User Role</DialogTitle>
                                      <DialogDescription>
                                        Assign a new role to {user.name || user.email}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div>
                                        <label className="text-sm font-medium mb-2 block">
                                          Select New Role
                                        </label>
                                        <select
                                          className="w-full px-3 py-2 border rounded-md"
                                          defaultValue={user.role}
                                          onChange={(e) => {
                                            setSelectedUser({ ...user, newRole: e.target.value });
                                          }}
                                        >
                                          <option value="user">User</option>
                                          <option value="contributor">Contributor</option>
                                          <option value="moderator">Moderator</option>
                                          <option value="editor">Editor</option>
                                          <option value="admin">Admin</option>
                                          <option value="core_admin">Core Admin</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium mb-2 block">
                                          Reason (Optional)
                                        </label>
                                        <Textarea
                                          placeholder="Why are you changing this user's role?"
                                          value={roleChangeReason}
                                          onChange={(e) => setRoleChangeReason(e.target.value)}
                                          rows={3}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => {
                                          if (selectedUser?.newRole) {
                                            handleRoleChange(
                                              user.id,
                                              selectedUser.newRole,
                                              roleChangeReason
                                            );
                                          }
                                        }}
                                        disabled={assignRoleMutation.isPending}
                                      >
                                        {assignRoleMutation.isPending ? "Updating..." : "Update Role"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                
                                {/* Deactivate User */}
                                {user.isActive && user.id !== 1 && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                      >
                                        <UserX className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will deactivate {user.name || user.email}'s account.
                                          They will not be able to access the platform.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeactivateUser(user.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Deactivate
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* CONTENT TAB */}
                <TabsContent value="content">
                  <ContentManagementTab />
                </TabsContent>

                {/* ROLES TAB */}
                <TabsContent value="roles">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Role Hierarchy</h3>
                      <Badge variant="outline">{roleHierarchy?.length || 0} Roles</Badge>
                    </div>
                    <div className="space-y-3">
                      {roleHierarchy?.map((role) => (
                        <Card key={role.roleName} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant={
                                  role.level === 6 ? 'default' :
                                  role.level >= 4 ? 'secondary' :
                                  'outline'
                                }>
                                  Level {role.level}
                                </Badge>
                                <p className="font-semibold">{role.displayName}</p>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {role.description || `${role.roleName} role`}
                              </p>
                              {role.canAssignRoles && role.canAssignRoles.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-muted-foreground">Can assign:</span>
                                  {role.canAssignRoles.map((assignableRole: string) => (
                                    <Badge key={assignableRole} variant="outline" className="text-xs">
                                      {assignableRole}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {role.roleName}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* AUDIT LOG TAB */}
                <TabsContent value="audit">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Role Change Audit Log</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{auditLog?.length || 0} Entries</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetchAuditLog()}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {auditLog && auditLog.length > 0 ? (
                      <div className="space-y-3">
                        {auditLog.map((entry) => (
                          <Card key={entry.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="h-4 w-4 text-blue-500" />
                                  <p className="font-medium">
                                    User #{entry.userId} Role Change
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {entry.previousRole}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">→</span>
                                  <Badge variant="default" className="text-xs">
                                    {entry.newRole}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {entry.reason || 'No reason provided'}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>
                                    By: User #{entry.assignedBy}
                                  </span>
                                  <span>
                                    {new Date(entry.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No audit log entries yet</p>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* SYSTEM TAB */}
                <TabsContent value="system">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">System Administration</h3>
                    
                    {/* System Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <Database className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Database</p>
                            <p className="text-xl font-bold">PostgreSQL</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <Activity className="h-8 w-8 text-green-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="text-xl font-bold text-green-500">Operational</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <Shield className="h-8 w-8 text-purple-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Security</p>
                            <p className="text-xl font-bold">Active</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* System Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Database className="h-6 w-6 text-blue-500" />
                          <h3 className="text-lg font-semibold">Database Management</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Access database administration tools and run queries
                        </p>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Eye className="h-4 w-4 mr-2" />
                            View Database Schema
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Database className="h-4 w-4 mr-2" />
                            Run SQL Query
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Backup Database
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="h-6 w-6 text-yellow-500" />
                          <h3 className="text-lg font-semibold">Security & Monitoring</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Monitor security events and system health
                        </p>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Activity className="h-4 w-4 mr-2" />
                            View System Logs
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Shield className="h-4 w-4 mr-2" />
                            Security Dashboard
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            View Alerts
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <BarChart3 className="h-6 w-6 text-green-500" />
                          <h3 className="text-lg font-semibold">Analytics & Metrics</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          View detailed platform analytics and performance metrics
                        </p>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Platform Analytics
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            User Analytics
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Activity className="h-4 w-4 mr-2" />
                            Performance Metrics
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Settings className="h-6 w-6 text-purple-500" />
                          <h3 className="text-lg font-semibold">Platform Settings</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configure platform-wide settings and preferences
                        </p>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Settings className="h-4 w-4 mr-2" />
                            General Settings
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Shield className="h-4 w-4 mr-2" />
                            Security Settings
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            Content Settings
                          </Button>
                        </div>
                      </Card>
                    </div>

                    {/* Danger Zone */}
                    <Card className="p-6 border-red-500/50 bg-red-500/5">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Irreversible actions that affect the entire platform
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete All Test Data
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete All Test Data?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete all test content including blog posts, forum threads, events, and jobs.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => {
                                  toast.info("Test data deletion will be implemented soon");
                                }}
                              >
                                Delete All Test Data
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10">
                          <Database className="h-4 w-4 mr-2" />
                          Reset Database
                        </Button>
                      </div>
                    </Card>
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

// Content Management Tab Component
function ContentManagementTab() {
  const [contentType, setContentType] = useState<'blogs' | 'forums' | 'events' | 'jobs' | 'gigs' | 'hubs' | 'communities' | 'startups' | 'opportunities' | 'learning'>('blogs');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Queries for all content types
  const { data: blogs, refetch: refetchBlogs } = trpc.admin.getAllBlogPosts.useQuery();
  const { data: forums, refetch: refetchForums } = trpc.admin.getAllForumThreads.useQuery();
  const { data: events, refetch: refetchEvents } = trpc.admin.getAllEvents.useQuery();
  const { data: jobs, refetch: refetchJobs } = trpc.admin.getAllJobs.useQuery();
  const { data: gigs, refetch: refetchGigs } = trpc.admin.getAllGigs.useQuery();
  const { data: hubs, refetch: refetchHubs } = trpc.admin.getAllHubs.useQuery();
  const { data: communities, refetch: refetchCommunities } = trpc.admin.getAllCommunities.useQuery();
  const { data: startups, refetch: refetchStartups } = trpc.admin.getAllStartups.useQuery();
  const { data: opportunities, refetch: refetchOpportunities } = trpc.admin.getAllOpportunities.useQuery();
  const { data: learning, refetch: refetchLearning } = trpc.admin.getAllLearningResources.useQuery();

  // Delete mutations
  const deleteBlogMutation = trpc.admin.deleteBlogPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted");
      refetchBlogs();
    },
  });

  const deleteForumMutation = trpc.admin.deleteForumThread.useMutation({
    onSuccess: () => {
      toast.success("Forum thread deleted");
      refetchForums();
    },
  });

  const deleteEventMutation = trpc.admin.deleteEvent.useMutation({
    onSuccess: () => {
      toast.success("Event deleted");
      refetchEvents();
    },
  });

  const deleteJobMutation = trpc.admin.deleteJob.useMutation({
    onSuccess: () => {
      toast.success("Job deleted");
      refetchJobs();
    },
  });

  const deleteGigMutation = trpc.admin.deleteGig.useMutation({
    onSuccess: () => {
      toast.success("Gig deleted");
      refetchGigs();
    },
  });

  const deleteHubMutation = trpc.admin.deleteHub.useMutation({
    onSuccess: () => {
      toast.success("Hub deleted");
      refetchHubs();
    },
  });

  const deleteCommunityMutation = trpc.admin.deleteCommunity.useMutation({
    onSuccess: () => {
      toast.success("Community deleted");
      refetchCommunities();
    },
  });

  const deleteStartupMutation = trpc.admin.deleteStartup.useMutation({
    onSuccess: () => {
      toast.success("Startup deleted");
      refetchStartups();
    },
  });

  const deleteOpportunityMutation = trpc.admin.deleteOpportunity.useMutation({
    onSuccess: () => {
      toast.success("Opportunity deleted");
      refetchOpportunities();
    },
  });

  const deleteLearningMutation = trpc.admin.deleteLearningResource.useMutation({
    onSuccess: () => {
      toast.success("Learning resource deleted");
      refetchLearning();
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = trpc.admin.bulkDelete.useMutation({
    onSuccess: (data) => {
      toast.success(`Deleted ${data.count} items`);
      setSelectedItems([]);
      // Refetch based on content type
      switch (contentType) {
        case 'blogs': refetchBlogs(); break;
        case 'forums': refetchForums(); break;
        case 'events': refetchEvents(); break;
        case 'jobs': refetchJobs(); break;
        case 'gigs': refetchGigs(); break;
        case 'hubs': refetchHubs(); break;
        case 'communities': refetchCommunities(); break;
        case 'startups': refetchStartups(); break;
        case 'opportunities': refetchOpportunities(); break;
        case 'learning': refetchLearning(); break;
      }
    },
  });

  const handleDelete = (id: number, type: string) => {
    switch (type) {
      case 'blogs': deleteBlogMutation.mutate(id); break;
      case 'forums': deleteForumMutation.mutate(id); break;
      case 'events': deleteEventMutation.mutate(id); break;
      case 'jobs': deleteJobMutation.mutate(id); break;
      case 'gigs': deleteGigMutation.mutate(id); break;
      case 'hubs': deleteHubMutation.mutate(id); break;
      case 'communities': deleteCommunityMutation.mutate(id); break;
      case 'startups': deleteStartupMutation.mutate(id); break;
      case 'opportunities': deleteOpportunityMutation.mutate(id); break;
      case 'learning': deleteLearningMutation.mutate(id); break;
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    const contentTypeMap: Record<typeof contentType, string> = {
      blogs: 'blog_posts',
      forums: 'forum_threads',
      events: 'events',
      jobs: 'jobs',
      gigs: 'gigs',
      hubs: 'hubs',
      communities: 'communities',
      startups: 'startups',
      opportunities: 'opportunities',
      learning: 'learning_resources',
    };

    bulkDeleteMutation.mutate({
      contentType: contentTypeMap[contentType] as any,
      ids: selectedItems,
    });
  };

  // Get current data based on content type
  const getCurrentData = () => {
    switch (contentType) {
      case 'blogs': return blogs || [];
      case 'forums': return forums || [];
      case 'events': return events || [];
      case 'jobs': return jobs || [];
      case 'gigs': return gigs || [];
      case 'hubs': return hubs || [];
      case 'communities': return communities || [];
      case 'startups': return startups || [];
      case 'opportunities': return opportunities || [];
      case 'learning': return learning || [];
      default: return [];
    }
  };

  const currentData = getCurrentData();
  const filteredData = currentData.filter((item: any) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Content Management - Full CRUD Access</h3>
        <Badge variant="outline">{filteredData.length} Items</Badge>
      </div>

      {/* Content Type Tabs */}
      <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="blogs">Blogs ({blogs?.length || 0})</TabsTrigger>
          <TabsTrigger value="forums">Forums ({forums?.length || 0})</TabsTrigger>
          <TabsTrigger value="events">Events ({events?.length || 0})</TabsTrigger>
          <TabsTrigger value="jobs">Jobs ({jobs?.length || 0})</TabsTrigger>
          <TabsTrigger value="gigs">Gigs ({gigs?.length || 0})</TabsTrigger>
        </TabsList>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="hubs">Hubs ({hubs?.length || 0})</TabsTrigger>
          <TabsTrigger value="communities">Communities ({communities?.length || 0})</TabsTrigger>
          <TabsTrigger value="startups">Startups ({startups?.length || 0})</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities ({opportunities?.length || 0})</TabsTrigger>
          <TabsTrigger value="learning">Learning ({learning?.length || 0})</TabsTrigger>
        </TabsList>

        {/* Search and Actions */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedItems.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selectedItems.length} items?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the selected items. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Content List */}
        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No {contentType} found</p>
            </Card>
          ) : (
            filteredData.map((item: any) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{item.title || item.name}</p>
                      {item.status && (
                        <Badge variant={
                          item.status === 'published' || item.status === 'approved' ? 'default' :
                          item.status === 'pending' ? 'secondary' :
                          'outline'
                        }>
                          {item.status}
                        </Badge>
                      )}
                      {item.featured && (
                        <Badge variant="default" className="bg-yellow-500">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{item.title || item.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id, contentType)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
